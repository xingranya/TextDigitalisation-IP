import { useMemo, useRef, useState } from 'react'
import { Copy, Sparkles, Square, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CharacterRecord } from '../types/character'
import { readAIConfig } from '../lib/ai-config'
import { chatCompletionOnce, streamChatCompletion } from '../services/ai-client'
import { buildCharacterGuideMessages, promptVersion } from '../services/ai-prompts'

type GuideStatus = 'idle' | 'loading' | 'done' | 'error'

const getCacheKey = (id: string) => `ai:guide:${promptVersion}:${id}`

const parseSections = (text: string) => {
  const matches = Array.from(text.matchAll(/【([^】]+)】/g))
  if (matches.length === 0) {
    return [{ title: '导读', content: text.trim() }]
  }

  const sections: { title: string; content: string }[] = []
  matches.forEach((match, index) => {
    const title = match[1]?.trim() || '导读'
    const start = (match.index ?? 0) + match[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index ?? text.length : text.length
    const content = text.slice(start, end).trim()
    sections.push({ title, content })
  })

  return sections.filter((item) => item.content.length > 0)
}

export function CharacterAIGuide({ character }: { character: CharacterRecord }) {
  const config = readAIConfig()
  const [status, setStatus] = useState<GuideStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [content, setContent] = useState<string>(() => {
    const cache = sessionStorage.getItem(getCacheKey(character.id))
    return cache ?? ''
  })

  const controllerRef = useRef<AbortController | null>(null)

  const sections = useMemo(() => parseSections(content), [content])

  const canRun = Boolean(config.apiKey)

  const handleStop = () => {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (status === 'loading') {
      setStatus(content ? 'done' : 'idle')
    }
  }

  const handleCopy = async () => {
    if (!content) {
      return
    }
    await navigator.clipboard.writeText(content)
  }

  const runGuide = async () => {
    if (!config.apiKey) {
      setStatus('error')
      setErrorMessage('AI 未配置，请在 .env.local 中设置 VITE_DASHSCOPE_API_KEY')
      return
    }

    controllerRef.current?.abort()
    controllerRef.current = new AbortController()

    setErrorMessage(null)
    setStatus('loading')
    setContent('')

    const messages = buildCharacterGuideMessages(character)
    const buffer: string[] = []

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
        setContent(buffer.join(''))
      }

      const finalText = buffer.join('').trim()
      setContent(finalText)
      sessionStorage.setItem(getCacheKey(character.id), finalText)
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
          setContent(finalText)
          sessionStorage.setItem(getCacheKey(character.id), finalText)
          setStatus('done')
          setErrorMessage(null)
        }
      } catch (fallbackError) {
        if (!errorMessage) {
          setErrorMessage(fallbackError instanceof Error ? fallbackError.message : 'AI 请求失败')
        }
      }
    }
  }

  return (
    <section className="paper-panel p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="ai-guide-mark">
            <Sparkles className="h-4 w-4" />
            <div className="section-kicker text-[color:color-mix(in_oklab,var(--accent-bronze)_75%,var(--ink-strong))]">AI 导读</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-2 text-xs font-medium tracking-widest text-[var(--ink-strong)] transition hover:border-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
            >
              <Square className="h-3 w-3" />
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={runGuide}
              disabled={!canRun}
              className="ai-guide-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
            >
              <Wand2 aria-hidden="true" className="h-4 w-4" />
              一键生成导读
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!content}
            aria-label="复制 AI 导读"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] transition duration-300 hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!canRun && (
        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">
          AI 未配置。请在项目根目录创建 .env.local，并设置 VITE_DASHSCOPE_API_KEY / VITE_DASHSCOPE_MODEL。
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-2xl border border-[color:color-mix(in_oklab,var(--accent-red)_32%,var(--line))] bg-[color:color-mix(in_oklab,var(--accent-red)_7%,var(--paper))] px-4 py-3 text-sm leading-7 text-[var(--ink-strong)]">
          {errorMessage}
        </div>
      )}

      {content && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-5 grid gap-3"
        >
          {sections.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-4">
              <div className="text-xs tracking-[0.28em] text-[var(--ink-muted)]">{item.title}</div>
              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--ink-soft)]">{item.content}</div>
            </article>
          ))}
        </motion.div>
      )}
    </section>
  )
}
