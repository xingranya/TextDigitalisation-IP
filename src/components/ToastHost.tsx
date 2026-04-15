import { AnimatePresence, motion } from 'framer-motion'

export function ToastHost({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+6.2rem)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--ink-strong)] px-6 py-3 text-sm tracking-wider text-[var(--paper)] shadow-lg whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
