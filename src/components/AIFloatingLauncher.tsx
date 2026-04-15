import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'

const coachmarkStorageKey = 'jingchu-ai-coachmark-v1'

export function AIFloatingLauncher({ onOpen }: { onOpen: () => void }) {
  const [isCoachmarkVisible, setIsCoachmarkVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return localStorage.getItem(coachmarkStorageKey) !== '1'
  })

  const markSeen = () => {
    localStorage.setItem(coachmarkStorageKey, '1')
    setIsCoachmarkVisible(false)
  }

  const handleOpen = () => {
    markSeen()
    onOpen()
  }

  return (
    <>
      <AnimatePresence>
        {isCoachmarkVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-[color:color-mix(in_oklab,var(--ink-strong)_55%,transparent)]" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute bottom-[calc(env(safe-area-inset-bottom)+7.8rem)] right-4 w-[min(22rem,calc(100vw-2rem))] rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--paper)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--paper-strong)_92%,white)] p-4 shadow-[0_22px_70px_color-mix(in_oklab,var(--ink-strong)_22%,transparent)] md:bottom-10 md:right-10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-xs tracking-[0.28em] text-[var(--ink-muted)]">AI 导览提示</div>
                  <div className="text-lg leading-7 text-[var(--ink-strong)]">
                    不知道先看哪个字？让 AI 先帮你挑 3 个入口字
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="关闭提示"
                  onClick={markSeen}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink-soft)] transition hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--accent-bronze)_16%,var(--paper))] px-5 py-3 text-sm font-medium tracking-[0.18em] text-[var(--ink-strong)] transition hover:border-[var(--accent-bronze)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-[var(--accent-bronze)]" />
                  开始提问
                </button>
                <button
                  type="button"
                  onClick={markSeen}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 py-3 text-sm tracking-[0.18em] text-[var(--ink-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  我先看看
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="打开 AI 问答"
        onClick={handleOpen}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.6rem)] right-4 z-30 inline-flex items-center gap-3 rounded-full border border-[color:color-mix(in_oklab,var(--accent-bronze)_45%,var(--line-strong))] bg-[color:color-mix(in_oklab,var(--paper-strong)_92%,white)] px-5 py-4 text-sm font-medium tracking-[0.18em] text-[var(--ink-strong)] shadow-[0_18px_52px_color-mix(in_oklab,var(--ink-strong)_16%,transparent)] transition hover:border-[var(--accent-bronze)] hover:shadow-[0_22px_60px_color-mix(in_oklab,var(--accent-bronze)_22%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] md:bottom-8 md:right-8"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--accent-bronze)_16%,var(--paper))]">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-[var(--accent-bronze)]" />
        </span>
        <span>问 AI 选字</span>
      </button>
    </>
  )
}
