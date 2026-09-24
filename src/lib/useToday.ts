import { useContext } from 'react'
import { TodayContext } from './today-context'

export function useToday() {
  const today = useContext(TodayContext)
  if (!today) throw new Error('TodayProvider is missing from the page root.')
  return today
}
