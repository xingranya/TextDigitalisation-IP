import { Home, Compass, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function MobileTabBar() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 2000)
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--paper)_92%,transparent)] px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <button type="button" className="flex flex-col items-center gap-1 p-2 text-[var(--accent-red)]">
          <Home className="h-5 w-5" />
          <span className="text-[0.65rem] font-medium tracking-widest">字库</span>
        </button>
        <button type="button" onClick={() => showToast('数字游览路线规划中，敬请期待')} className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors">
          <Compass className="h-5 w-5" />
          <span className="text-[0.65rem] font-medium tracking-widest">路线</span>
        </button>
        <button type="button" onClick={() => showToast('文创商城即将上线')} className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[0.65rem] font-medium tracking-widest">文创</span>
        </button>
        <button type="button" onClick={() => showToast('个人中心开发中')} className="flex flex-col items-center gap-1 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-strong)] transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[0.65rem] font-medium tracking-widest">我的</span>
        </button>
      </nav>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
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
