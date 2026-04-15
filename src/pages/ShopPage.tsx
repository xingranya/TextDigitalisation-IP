import { useMemo, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { CharacterRecord } from '../types/character'

interface ShopPageProps {
  characters: CharacterRecord[]
  onPickCharacter: (id: string) => void
}

type ExtensionGroup = {
  title: string
  items: { id: string; char: string; note: string; accent: string; category: string }[]
}

export function ShopPage({ characters, onPickCharacter }: ShopPageProps) {
  const categories = useMemo(
    () => ['全部', ...new Set(characters.map((item) => item.category))],
    [characters],
  )
  const [activeCategory, setActiveCategory] = useState('全部')

  const groups = useMemo(() => {
    const map = new Map<string, ExtensionGroup>()
    characters.forEach((character) => {
      if (activeCategory !== '全部' && character.category !== activeCategory) {
        return
      }
      character.extensions.forEach((ext) => {
        const key = ext.title.trim() || '延展提案'
        const group = map.get(key) ?? { title: key, items: [] }
        group.items.push({
          id: character.id,
          char: character.char,
          note: ext.note,
          accent: character.accent,
          category: character.category,
        })
        map.set(key, group)
      })
    })

    return Array.from(map.values())
      .map((group) => ({
        ...group,
        items: group.items.slice(0, 8),
      }))
      .sort((a, b) => b.items.length - a.items.length)
  }, [activeCategory, characters])

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 md:px-8 lg:px-12">
      <header className="paper-panel p-5 md:p-6">
        <div className="section-kicker">延展文创</div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
          <div className="space-y-3">
            <h1 className="text-3xl text-[var(--ink-strong)] md:text-4xl">把楚字带回生活</h1>
            <p className="max-w-[44rem] text-sm leading-8 text-[var(--ink-soft)] md:text-base">
              每个汉字不止是一张图，更是一组可落地的设计方向：从路线导视到伴手礼包装，从纪念章到展陈标题字，都是可以直接转化为文创的视觉素材。
            </p>
          </div>
          <div className="paper-panel bg-[color:var(--paper)] p-4">
            <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-[var(--ink-muted)]">
              <Sparkles className="h-4 w-4 text-[var(--accent-bronze)]" />
              <span>灵感入口</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
              点开任意提案中的汉字，回到字库详情页，继续查看母题与图集。
            </p>
          </div>
        </div>
      </header>

      <section className="mt-6 paper-panel detail-scroll sticky top-3 z-20 flex flex-nowrap gap-2 overflow-x-auto p-3 md:top-4">
        {categories.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`filter-chip ${isActive ? 'filter-chip-active' : ''}`}
            >
              <span>{category}</span>
            </button>
          )
        })}
      </section>

      {groups.length > 0 ? (
        <section className="mt-6 grid gap-5">
          {groups.map((group) => (
            <article key={group.title} className="paper-panel p-5 md:p-6">
              <div className="section-kicker">提案方向</div>
              <h2 className="mt-3 flex items-center gap-2 text-xl text-[var(--ink-strong)] md:text-2xl">
                <span>{group.title}</span>
                <ArrowRight className="h-4 w-4 text-[var(--accent-red)]" />
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <button
                    key={`${group.title}:${item.id}`}
                    type="button"
                    onClick={() => onPickCharacter(item.id)}
                    className="paper-panel bg-[color:var(--paper)] p-4 text-left transition hover:border-[var(--line-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs tracking-[0.24em] text-[var(--ink-muted)]">{item.category}</div>
                        <div className="mt-2 flex items-end gap-3">
                          <div
                            className="collection-display text-4xl leading-none"
                            style={{ color: item.accent }}
                          >
                            {item.char}
                          </div>
                          <div className="text-sm tracking-[0.22em] text-[var(--ink-soft)]">查看详情</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--ink-muted)]" />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{item.note}</p>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-6 paper-panel flex min-h-[18rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <div className="section-kicker">暂无提案</div>
          <h2 className="text-2xl text-[var(--ink-strong)]">当前分类还没有可用的延展方向</h2>
          <p className="max-w-[34rem] text-sm leading-8 text-[var(--ink-soft)]">
            你可以先回到字库浏览其他系列，或切换到“全部”查看已整理的文创方向。
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory('全部')}
            className="keyword-chip"
          >
            查看全部提案
          </button>
        </section>
      )}
    </main>
  )
}

