export type AppPage = 'home' | 'shop' | 'profile' | 'immersive'

export interface BrowserState {
  page: AppPage
  query: string
  category: string
  selectedId: string | null
}

export const readBrowserState = (): BrowserState => {
  const params = new URLSearchParams(window.location.search)
  const rawPage = params.get('page')
  const page: AppPage =
    rawPage === 'shop' || rawPage === 'profile' || rawPage === 'immersive' ? rawPage : 'home'

  return {
    page,
    query: params.get('q') ?? '',
    category: params.get('cat') ?? '全部',
    selectedId: params.get('char'),
  }
}

export const writeBrowserState = (state: BrowserState) => {
  const params = new URLSearchParams()

  if (state.page && state.page !== 'home') {
    params.set('page', state.page)
  }

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
