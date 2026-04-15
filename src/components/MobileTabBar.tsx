import { Home, Sparkles, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function MobileTabBar({ onOpenAIChat }: { onOpenAIChat: () => void }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 2000)
  }

  return (
    <>
      <nav 
        aria-label="移动端底部导航" 
        className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--paper-strong)_92%,var(--paper))] px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <button 
          type="button" 
          aria-label="返回字库首页" 
          className="flex flex-col items-center gap-1 p-2 text-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] rounded-lg"
        >
          <Home aria-hidden="true" className="h-5 w-5" />
          <span className="text-[0.75rem] font-medium tracking-[0.22em]">字库</span>
        </button>
        <button 
          type="button" 
          aria-label="打开 AI 问答" 
          onClick={onOpenAIChat} 
          className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] rounded-lg"
        >
          <Sparkles aria-hidden="true" className="h-5 w-5" />
          <span className="text-[0.75rem] font-medium tracking-[0.22em]">问AI</span>
        </button>
        <button 
          type="button" 
          aria-label="进入文创商城" 
          onClick={() => showToast('文创商城即将上线')} 
          className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] rounded-lg"
        >
          <ShoppingBag aria-hidden="true" className="h-5 w-5" />
          <span className="text-[0.75rem] font-medium tracking-[0.22em]">文创</span>
        </button>
        <button 
          type="button" 
          aria-label="进入个人中心" 
          onClick={() => showToast('个人中心开发中')} 
          className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] rounded-lg"
        >
          <User aria-hidden="true" className="h-5 w-5" />
          <span className="text-[0.75rem] font-medium tracking-[0.22em]">我的</span>
        </button>
      </nav>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--ink-strong)] text-[var(--paper)] rounded-full text-sm tracking-wider shadow-lg whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
