import { useEffect, useState, type ReactNode } from 'react'
import { localToday } from './local-date'
import { TodayContext } from './today-context'

export function TodayProvider({ initialToday, children }: { initialToday: string; children: ReactNode }) {
  const [today, setToday] = useState(initialToday)

  useEffect(() => {
    let timer = 0
    let disposed = false
    const refresh = () => setToday(localToday())
    const scheduleMidnightRefresh = () => {
      window.clearTimeout(timer)
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = window.setTimeout(() => {
        if (disposed) return
        refresh()
        scheduleMidnightRefresh()
      }, Math.max(1000, midnight.getTime() - now.getTime()))
    }
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    refresh()
    scheduleMidnightRefresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      disposed = true
      window.clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  return <TodayContext.Provider value={today}>{children}</TodayContext.Provider>
}
