'use client'

import { useEffect } from 'react'
import type { Task } from '@/types'

export default function NotificationManager({ tasks }: { tasks: Task[] }) {
  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'denied') return

    async function checkAndNotify() {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission()
        if (perm !== 'granted') return
      }

      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const dueTodayPending = tasks.filter(
        t => t.date === todayStr && t.status === 'pending'
      )
      const dueTomorrow = tasks.filter(
        t => t.date === tomorrowStr && t.status === 'pending'
      )

      if (dueTodayPending.length > 0) {
        new Notification('GlanceFlow — Task in scadenza oggi', {
          body: dueTodayPending.map(t => `• ${t.title}`).join('\n'),
          icon: '/icon-192.png',
        })
      }

      if (dueTomorrow.length > 0) {
        setTimeout(() => {
          new Notification('GlanceFlow — Task in scadenza domani', {
            body: dueTomorrow.map(t => `• ${t.title}`).join('\n'),
            icon: '/icon-192.png',
          })
        }, 3000)
      }
    }

    if (tasks.length > 0) checkAndNotify()
  }, [tasks])

  return null
}
