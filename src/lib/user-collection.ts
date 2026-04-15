const favoritesKey = 'jingchu:favorites:v1'
const recentViewsKey = 'jingchu:recent-views:v1'

const memory = {
  favorites: [] as string[],
  recentViews: [] as string[],
}

const canUseStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

const readList = (key: string, fallback: string[]) => {
  if (!canUseStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : fallback
  } catch {
    return fallback
  }
}

const writeList = (key: string, value: string[]) => {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export const storageAvailable = () => canUseStorage()

export const getFavorites = () => {
  memory.favorites = readList(favoritesKey, memory.favorites)
  return memory.favorites
}

export const isFavorite = (id: string) => {
  return getFavorites().includes(id)
}

export const toggleFavorite = (id: string) => {
  const favorites = getFavorites()
  const exists = favorites.includes(id)
  const next = exists ? favorites.filter((item) => item !== id) : [id, ...favorites]
  memory.favorites = next
  writeList(favoritesKey, next)
  return { isFavorite: !exists, favorites: next }
}

export const getRecentViews = () => {
  memory.recentViews = readList(recentViewsKey, memory.recentViews)
  return memory.recentViews
}

export const pushRecentView = (id: string, limit = 20) => {
  const views = getRecentViews()
  const next = [id, ...views.filter((item) => item !== id)].slice(0, limit)
  memory.recentViews = next
  writeList(recentViewsKey, next)
  return next
}

