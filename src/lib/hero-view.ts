export type HeroView = 'schematic' | 'board'
export const VIEW_KEY = 'u1-view'

export const readSavedView = (): HeroView => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'board' ? 'board' : 'schematic'
  } catch {
    return 'schematic'
  }
}
