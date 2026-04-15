import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
  useRef,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ScrollText } from 'lucide-react'
import { SearchHero } from './components/SearchHero'
import { CategoryRail } from './components/CategoryRail'
import { CharacterCard } from './components/CharacterCard'
import { CharacterDetailModal } from './components/CharacterDetailModal'
import { MobileTabBar } from './components/MobileTabBar'
import { Footer } from './components/Footer'
import { AIChatSheet } from './components/AIChatSheet'
import { AIFloatingLauncher } from './components/AIFloatingLauncher'
import { jingchuCharacters } from './data/characters'
import { filterCharacters } from './lib/filter-characters'
import { readBrowserState, writeBrowserState } from './lib/url-state'

const initialState = readBrowserState()

function App() {
  const [searchTerm, setSearchTerm] = useState(initialState.query)
  const [activeCategory, setActiveCategory] = useState(initialState.category)
  const [selectedId, setSelectedId] = useState<string | null>(initialState.selectedId)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const searchTimeoutRef = useRef<number | null>(null)
  const modalTriggerRef = useRef<HTMLElement | null>(null)
  const aiTriggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const deferredSearchTerm = useDeferredValue(searchTerm)
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }
    }
  }, [])

  const categories = ['全部', ...new Set(jingchuCharacters.map((item) => item.category))]
  const filteredCharacters = filterCharacters(
    jingchuCharacters,
    deferredSearchTerm,
    activeCategory,
  ).sort((a, b) => {
    if (!deferredSearchTerm) {
      const aPriority = a.priority ?? 0
      const bPriority = b.priority ?? 0

      if (bPriority !== aPriority) {
        return bPriority - aPriority
      }

      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
    }
    return 0
  })
  const selectedCharacter =
    jingchuCharacters.find((item) => item.id === selectedId) ?? null
  const keywordSuggestions = jingchuCharacters
    .filter((item) => item.featured)
    .slice(0, 6)
    .map((item) => item.char)

  const categoryCounts = categories.reduce<Record<string, number>>((result, category) => {
    result[category] =
      category === '全部'
        ? jingchuCharacters.length
        : jingchuCharacters.filter((item) => item.category === category).length

    return result
  }, {})

  const focusBack = (element: HTMLElement | null) => {
    if (!element) return
    window.setTimeout(() => {
      element.focus()
    }, 0)
  }

  const handleCloseCharacter = () => {
    setSelectedId(null)
    focusBack(modalTriggerRef.current)
  }

  const handleOpenCharacter = (id: string) => {
    if (!selectedId) {
      modalTriggerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
    setSelectedId(id)
  }

  const handleCloseAIChat = () => {
    setIsAIChatOpen(false)
    focusBack(aiTriggerRef.current)
  }

  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (selectedId) {
        handleCloseCharacter()
        return
      }
      if (isAIChatOpen) {
        handleCloseAIChat()
      }
    }
  })

  useEffect(() => {
    document.body.style.overflow = selectedCharacter || isAIChatOpen ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [selectedCharacter, isAIChatOpen])

  useEffect(() => {
    if (!selectedCharacter && !isAIChatOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      handleEscape(event)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedCharacter, isAIChatOpen])

  useEffect(() => {
    writeBrowserState({
      query: searchTerm,
      category: activeCategory,
      selectedId,
    })
  }, [activeCategory, searchTerm, selectedId])

  const handleQueryChange = (value: string) => {
    // Basic sanitization: remove extreme special chars that might break regex or cause issues
    const sanitizedValue = value.replace(/[^\w\s\u4e00-\u9fa5]/gi, '').slice(0, 50)
    
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setSearchTerm(sanitizedValue)
      })
    }, 150)
  }

  const handleKeywordSelect = (value: string) => {
    startTransition(() => {
      setActiveCategory('全部')
      setSearchTerm(value)
    })
  }

  const handleOpenAIChat = () => {
    aiTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setIsAIChatOpen(true)
  }

  const handlePickCharacterFromAI = (char: string) => {
    const match = jingchuCharacters.find((item) => item.char === char)
    if (!match) {
      return
    }
    modalTriggerRef.current = aiTriggerRef.current
    setSelectedId(match.id)
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-50 flex items-center justify-center bg-[color:color-mix(in_oklab,var(--accent-red)_90%,black)] px-4 py-2 text-xs tracking-widest text-[var(--paper)]"
            role="alert"
          >
            网络已断开，您正在查看本地缓存的导览数据
          </motion.div>
        )}
      </AnimatePresence>
      
      <SearchHero
        query={searchTerm}
        total={jingchuCharacters.length}
        filteredTotal={filteredCharacters.length}
        keywordSuggestions={keywordSuggestions}
        onQueryChange={handleQueryChange}
        onKeywordSelect={handleKeywordSelect}
        onOpenAIChat={handleOpenAIChat}
      />

      <CategoryRail
        activeCategory={activeCategory}
        categories={categories}
        counts={categoryCounts}
        onSelect={setActiveCategory}
      />

      <main className="mx-auto mt-6 md:mt-8 w-full max-w-7xl px-5 pb-16 md:px-8 lg:px-12">
        {filteredCharacters.length > 0 ? (
          <section className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                onSelect={handleOpenCharacter}
              />
            ))}
          </section>
        ) : (
          <section className="paper-panel flex min-h-[22rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="section-kicker">暂无结果</div>
            <h2 className="text-3xl text-[var(--ink-strong)]">没有找到匹配的荆楚字符</h2>
            <p className="max-w-[32rem] text-sm leading-8 text-[var(--ink-soft)] md:text-base">
              可以试试搜索具体汉字，如“楚”“凤”“钟”，也可以改用母题词汇，比如“楚辞”“青铜”“图腾”。
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setActiveCategory('全部')
              }}
              className="keyword-chip"
            >
              清空筛选
            </button>
          </section>
        )}
      </main>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-10 pt-16 md:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:px-12 border-t border-[var(--line-strong)]">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="paper-panel flex flex-col gap-4 p-5 md:p-6"
        >
          <div className="section-kicker">楚文化溯源</div>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(12rem,0.9fr)]">
            <div className="space-y-4">
              <h2 className="text-2xl text-[var(--ink-strong)] md:text-3xl">
                一字一图腾，重现荆楚浪漫
              </h2>
              <p className="max-w-[40rem] text-sm leading-8 text-[var(--ink-soft)] md:text-base">
                两千多年前的楚地先民，将他们对宇宙的敬畏、对生命的礼赞，铸刻在青铜，描绘于漆木，书写在竹简之上。这些汉字不仅是交流的工具，更是沟通天地、对话神明的艺术载体。
              </p>
            </div>
            <div className="grid gap-3">
              <div className="paper-panel bg-[color:var(--paper)] p-4">
                <div className="section-kicker">扫码即游</div>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  在楚文化景区或博物馆扫码，随时开启你的专属数字导览。
                </p>
              </div>
              <div className="paper-panel bg-[color:var(--paper)] p-4">
                <div className="section-kicker">文创延展</div>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  发现汉字之美，将其带入生活，体验独具匠心的荆楚礼物。
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="paper-panel flex flex-col justify-between gap-5 p-5 md:p-6"
        >
          <div className="space-y-3">
            <div className="section-kicker">导览指南</div>
            <div className="space-y-4 text-sm leading-7 text-[var(--ink-soft)]">
              <p>向下滑动，从精选文字卡片开始，探索背后的文化母题。</p>
              <p>点击任意汉字卡片，即可进入沉浸式空间，欣赏艺术字形、聆听语音解读、观看3D文物模型，并发现延伸的文化创意。</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm tracking-[0.2em] text-[var(--ink-muted)]">
            <ScrollText className="h-4 w-4 text-[var(--accent-bronze)]" />
            <span>开启你的数字漫游</span>
          </div>
        </motion.article>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-7xl gap-5 px-5 md:px-8 lg:grid-cols-3 lg:px-12">
        {[
          {
            title: '青铜重器',
            description: '鼎、钟、剑、戈，冰冷的青铜承载着千年的热血。探寻楚国冶炼之精与礼乐之宏大。',
          },
          {
            title: '漆木芳华',
            description: '朱砂与漆黑的碰撞，在光影流转间感受楚人登峰造极的审美与生活意趣。',
          },
          {
            title: '神话图腾',
            description: '凤鸟腾跃、猛虎镇守。走入楚地先民奇诡神秘的内心世界，体验超越现实的浪漫。',
          },
        ].map((item) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="paper-panel p-5 md:p-6"
          >
            <div className="section-kicker">文化脉络</div>
            <h2 className="mt-3 flex items-center gap-2 text-xl text-[var(--ink-strong)]">
              <span>{item.title}</span>
              <ArrowRight className="h-4 w-4 text-[var(--accent-red)]" />
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--ink-soft)] md:text-base">
              {item.description}
            </p>
          </motion.article>
        ))}
      </section>

      <AnimatePresence>
        {selectedCharacter ? (
          <CharacterDetailModal
            character={selectedCharacter}
            onClose={handleCloseCharacter}
            onSelect={handleOpenCharacter}
          />
        ) : null}
      </AnimatePresence>
      <AIChatSheet
        isOpen={isAIChatOpen}
        onClose={handleCloseAIChat}
        characters={jingchuCharacters}
        onPickCharacter={handlePickCharacterFromAI}
      />
      <Footer />
      <MobileTabBar onOpenAIChat={handleOpenAIChat} />
      <AIFloatingLauncher onOpen={handleOpenAIChat} />
    </div>
  )
}

export default App
