import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Square, X } from 'lucide-react'
import type { CharacterRecord } from '../types/character'
import { readAIConfig } from '../lib/ai-config'
import { streamChatCompletion, chatCompletionOnce } from '../services/ai-client'
import { buildQAMessages } from '../services/ai-prompts'

type ChatStatus = 'idle' | 'loading' | 'done' | 'error'

const parseRecommendedChars = (text: string) => {
  const match = text.match(/【推荐】([^\n\r]+)/)
  if (!match) {
    return []
  }
  return match[1]
    .split('|')
    .map((value) => value.trim())
    .filter((value) => value.length === 1)
}

export interface AIChatSheetProps {
  isOpen: boolean
  onClose: () => void
  characters: CharacterRecord[]
  onPickCharacter: (char: string) => void
}

export function AIChatSheet({ isOpen, onClose, characters, onPickCharacter }: AIChatSheetProps) {
  const config = readAIConfig()
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const recommendedChars = useMemo(() => parseRecommendedChars(answer), [answer])

  const focusableSelector = useMemo(
    () =>
      [
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(','),
    [],
  )

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
    )

    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
      return
    }

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }, [isOpen])

  const stop = () => {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (status === 'loading') {
      setStatus(answer ? 'done' : 'idle')
    }
  }

  const send = async () => {
    if (!config.apiKey) {
      setStatus('error')
      setErrorMessage('AI 未配置，请在 .env.local 中设置 VITE_DASHSCOPE_API_KEY')
      return
    }

    const trimmed = question.trim()
    if (!trimmed) {
      return
    }

    controllerRef.current?.abort()
    controllerRef.current = new AbortController()
    setStatus('loading')
    setErrorMessage(null)
    setAnswer('')

    const buffer: string[] = []
    const messages = buildQAMessages(trimmed, characters)

    try {
      for await (const delta of streamChatCompletion({
        baseUrl: config.baseUrl,
        model: config.model,
        apiKey: config.apiKey,
        extraBody: config.extraBody,
        messages,
        signal: controllerRef.current.signal,
      })) {
        buffer.push(delta)
        setAnswer(buffer.join(''))
      }

      setStatus('done')
      controllerRef.current = null
    } catch (error) {
      if (controllerRef.current?.signal.aborted) {
        controllerRef.current = null
        return
      }

      controllerRef.current = null
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'AI 请求失败')

      try {
        const fallback = await chatCompletionOnce({
          baseUrl: config.baseUrl,
          model: config.model,
          apiKey: config.apiKey,
          extraBody: config.extraBody,
          messages,
        })
        const finalText = fallback.trim()
        if (finalText) {
          setAnswer(finalText)
          setStatus('done')
          setErrorMessage(null)
        }
      } catch {
        setStatus('error')
      }
    }
  }

  const handlePick = (char: string) => {
    onPickCharacter(char)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="关闭 AI 问答"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[color:color-mix(in_oklab,var(--ink-strong)_38%,transparent)]"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="AI 问答"
            tabIndex={-1}
            onKeyDown={handleDialogKeyDown}
            ref={(node) => {
              containerRef.current = node
            }}
            initial={{ y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl overflow-hidden rounded-t-[2rem] border border-[var(--line-strong)] bg-[var(--paper-strong)] shadow-[0_-22px_60px_color-mix(in_oklab,var(--ink-strong)_18%,transparent)]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--accent-bronze)]" />
                <div className="text-sm font-medium tracking-[0.24em] text-[var(--ink-muted)]">问 AI</div>
              </div>
              <div className="flex items-center gap-2">
                {status === 'loading' && (
                  <button
                    type="button"
                    onClick={stop}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-2 text-xs font-medium tracking-widest text-[var(--ink-strong)] transition hover:border-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                  >
                    <Square className="h-3 w-3" />
                    停止
                  </button>
                )}
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] transition duration-300 hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="grid gap-4 px-5 pb-6 pt-5">
              {!config.apiKey && (
                <div className="rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">
                  AI 未配置。请在项目根目录创建 .env.local，并设置 VITE_DASHSCOPE_API_KEY / VITE_DASHSCOPE_MODEL。
                </div>
              )}

              <div className="grid gap-3">
                <label className="text-sm tracking-[0.28em] text-[var(--ink-muted)]" htmlFor="ai-question">
                  你的问题
                </label>
                <textarea
                  id="ai-question"
                  ref={inputRef}
                  rows={3}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="例如：我想看一个和端午有关的字"
                  className="w-full resize-none rounded-2xl border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-3 text-base leading-7 text-[var(--ink-strong)] outline-none transition duration-300 placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs tracking-[0.2em] text-[var(--ink-muted)]">
                    {status === 'loading' ? '正在生成…' : status === 'error' ? '生成失败' : '支持自然语言提问'}
                  </div>
                  <button
                    type="button"
                    onClick={send}
                    disabled={status === 'loading' || !question.trim()}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--accent-red)_8%,var(--paper))] px-5 py-2 text-xs font-medium tracking-widest text-[var(--ink-strong)] transition hover:border-[var(--accent-red)] hover:bg-[color:color-mix(in_oklab,var(--accent-red)_14%,var(--paper))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--accent-red)_32%,var(--line))] bg-[color:color-mix(in_oklab,var(--accent-red)_7%,var(--paper))] px-4 py-3 text-sm leading-7 text-[var(--ink-strong)]">
                  {errorMessage}
                </div>
              )}

              {recommendedChars.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommendedChars.map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => handlePick(char)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-2 text-sm tracking-[0.22em] text-[var(--ink-strong)] transition hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                    >
                      <span className="text-xl leading-none">{char}</span>
                      <span className="text-xs tracking-widest text-[var(--ink-muted)]">查看</span>
                    </button>
                  ))}
                </div>
              )}

              {answer && (
                <div className="detail-scroll max-h-[44vh] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)] whitespace-pre-line">
                  {answer}
                </div>
              )}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}

