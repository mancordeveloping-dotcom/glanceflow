const APP_URL = 'https://glanceflow-git-main-mattiamancini047-5656s-projects.vercel.app'
const SUPABASE_URL = 'https://vovlwjwtcpfhtfpujmbr.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_AN_XfU0H-0CwopxMX17Yug_w77fzqli'

// ── DOM refs ──
const viewLogin  = document.getElementById('view-login')
const viewMain   = document.getElementById('view-main')
const btnLogout  = document.getElementById('btn-logout')
const btnLogin   = document.getElementById('btn-login')
const btnCapture = document.getElementById('btn-capture')
const btnSaveAll = document.getElementById('btn-save-all')
const inputEmail    = document.getElementById('input-email')
const inputPassword = document.getElementById('input-password')
const loginError    = document.getElementById('login-error')
const captureError  = document.getElementById('capture-error')
const successMsg    = document.getElementById('success-msg')
const userEmailEl   = document.getElementById('user-email')
const resultsEl     = document.getElementById('results')
const taskListEl    = document.getElementById('task-list')
const resultsCount  = document.getElementById('results-count')
const loginLabel    = document.getElementById('login-label')
const loginSpinner  = document.getElementById('login-spinner')
const captureLabel  = document.getElementById('capture-label')
const captureSpinner = document.getElementById('capture-spinner')

let extractedTasks = []

// ── Init ──
chrome.storage.local.get(['access_token', 'user_email'], ({ access_token, user_email }) => {
  if (access_token) showMain(user_email)
  else showLogin()
})

// ── Login ──
btnLogin.addEventListener('click', async () => {
  const email = inputEmail.value.trim()
  const password = inputPassword.value
  if (!email || !password) return showError(loginError, 'Enter email and password')

  setLoading(btnLogin, loginLabel, loginSpinner, true)
  loginError.style.display = 'none'

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.access_token) {
      await chrome.storage.local.set({ access_token: data.access_token, user_email: email })
      showMain(email)
    } else {
      showError(loginError, 'Invalid email or password')
    }
  } catch {
    showError(loginError, 'Connection error. Try again.')
  }
  setLoading(btnLogin, loginLabel, loginSpinner, false)
})

// ── Logout ──
btnLogout.addEventListener('click', async () => {
  await chrome.storage.local.remove(['access_token', 'user_email'])
  showLogin()
})

// ── Capture ──
btnCapture.addEventListener('click', async () => {
  captureError.style.display = 'none'
  successMsg.style.display = 'none'
  resultsEl.style.display = 'none'
  setLoading(btnCapture, captureLabel, captureSpinner, true)

  try {
    const { access_token } = await chrome.storage.local.get('access_token')

    // Capture screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' })
    const blob = await (await fetch(dataUrl)).blob()

    const formData = new FormData()
    formData.append('image', blob, 'screenshot.png')

    const res = await fetch(`${APP_URL}/api/extension/process`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access_token}` },
      body: formData,
    })

    if (res.status === 401) {
      await chrome.storage.local.remove(['access_token', 'user_email'])
      showLogin()
      return
    }

    const data = await res.json()
    if (data.error) {
      showError(captureError, data.error)
    } else {
      extractedTasks = data.tasks ?? []
      renderTasks(extractedTasks)
    }
  } catch {
    showError(captureError, 'Could not capture screenshot. Try again.')
  }
  setLoading(btnCapture, captureLabel, captureSpinner, false)
})

// ── Save all ──
btnSaveAll.addEventListener('click', async () => {
  if (!extractedTasks.length) return
  const { access_token } = await chrome.storage.local.get('access_token')

  btnSaveAll.disabled = true
  btnSaveAll.textContent = 'Saving…'

  try {
    await fetch(`${APP_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({ tasks: extractedTasks }),
    })
    resultsEl.style.display = 'none'
    successMsg.style.display = 'block'
  } catch {
    btnSaveAll.disabled = false
    btnSaveAll.textContent = 'Save all →'
  }
})

// ── Helpers ──
function showLogin() {
  viewLogin.style.display = 'block'
  viewMain.style.display = 'none'
  btnLogout.style.display = 'none'
  inputEmail.value = ''
  inputPassword.value = ''
}

function showMain(email) {
  viewLogin.style.display = 'none'
  viewMain.style.display = 'block'
  btnLogout.style.display = 'block'
  userEmailEl.textContent = email ?? ''
  resultsEl.style.display = 'none'
  successMsg.style.display = 'none'
}

function renderTasks(tasks) {
  if (!tasks.length) {
    showError(captureError, 'No tasks found in this screenshot.')
    return
  }
  taskListEl.innerHTML = tasks.map(t => `
    <div class="task-item">
      <span class="task-type ${t.type}">${t.type}</span>
      <div>
        <div class="task-title">${escHtml(t.title)}</div>
        ${(t.date || t.time) ? `<div class="task-meta">${[t.date, t.time].filter(Boolean).join(' · ')}</div>` : ''}
      </div>
    </div>
  `).join('')
  resultsCount.textContent = `${tasks.length} task${tasks.length > 1 ? 's' : ''} found`
  resultsEl.style.display = 'block'
}

function showError(el, msg) {
  el.textContent = msg
  el.style.display = 'block'
}

function setLoading(btn, label, spinner, loading) {
  btn.disabled = loading
  label.style.display = loading ? 'none' : 'inline'
  spinner.style.display = loading ? 'inline-block' : 'none'
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
