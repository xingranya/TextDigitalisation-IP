import { Home, Sparkles, ShoppingBag, User } from 'lucide-react'
import type { AppPage } from '../lib/url-state'

export function MobileTabBar({
  activePage,
  onNavigate,
  onOpenAIChat,
}: {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
  onOpenAIChat: () => void
}) {
  const base =
    'flex flex-col items-center gap-1 rounded-lg p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]'
  const active = 'text-[var(--accent-red)]'
  const idle = 'text-[var(--ink-muted)] hover:text-[var(--ink-strong)]'

  return (
    <nav
      aria-label="移动端底部导航"
      className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--paper-strong)_92%,var(--paper))] px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <button
        type="button"
        aria-label="返回字库首页"
        onClick={() => onNavigate('home')}
        className={`${base} ${activePage === 'home' ? active : idle}`}
      >
        <Home aria-hidden="true" className="h-5 w-5" />
        <span className="text-[0.75rem] font-medium tracking-[0.22em]">字库</span>
      </button>
      <button
        type="button"
        aria-label="打开 AI 问答"
        onClick={onOpenAIChat}
        className={`${base} ${idle}`}
      >
        <Sparkles aria-hidden="true" className="h-5 w-5" />
        <span className="text-[0.75rem] font-medium tracking-[0.22em]">问AI</span>
      </button>
      <button
        type="button"
        aria-label="进入文创"
        onClick={() => onNavigate('shop')}
        className={`${base} ${activePage === 'shop' ? active : idle}`}
      >
        <ShoppingBag aria-hidden="true" className="h-5 w-5" />
        <span className="text-[0.75rem] font-medium tracking-[0.22em]">文创</span>
      </button>
      <button
        type="button"
        aria-label="进入我的"
        onClick={() => onNavigate('profile')}
        className={`${base} ${activePage === 'profile' ? active : idle}`}
      >
        <User aria-hidden="true" className="h-5 w-5" />
        <span className="text-[0.75rem] font-medium tracking-[0.22em]">我的</span>
      </button>
    </nav>
  )
}
