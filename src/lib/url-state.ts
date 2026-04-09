export interface BrowserState {
  query: string
  category: string
  selectedId: string | null
}

export const readBrowserState = (): BrowserState => {
  const params = new URLSearchParams(window.location.search)

  return {
    query: params.get('q') ?? '',
    category: params.get('cat') ?? '全部',
    selectedId: params.get('char'),
  }
}

export const writeBrowserState = (state: BrowserState) => {
  const params = new URLSearchParams()

  if (state.query) {
    params.set('q', state.query)
  }

  if (state.category && state.category !== '全部') {
    params.set('cat', state.category)
  }

  if (state.selectedId) {
    params.set('char', state.selectedId)
  }

  const query = params.toString()
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname

  window.history.replaceState({}, '', nextUrl)
}
