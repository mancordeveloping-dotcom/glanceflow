import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center space-y-8">
      {/* Glow */}
      <div className="absolute w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* 404 number */}
      <div className="relative">
        <p className="text-[120px] font-extrabold leading-none gradient-text opacity-20 select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-violet-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="relative space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Page not found</h1>
        <p className="text-slate-400 max-w-sm mx-auto">
          This page doesn't exist or has been moved. Let's get you back on track.
        </p>
      </div>

      <div className="relative flex items-center gap-4">
        <Link
          href="/"
          className="shimmer-btn btn-3d rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white"
        >
          ← Back to home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
