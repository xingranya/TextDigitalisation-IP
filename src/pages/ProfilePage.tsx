import { useMemo } from 'react'
import { ArrowRight, ScrollText, Sparkles, X } from 'lucide-react'
import type { CharacterRecord } from '../types/character'

interface ProfilePageProps {
  characters: CharacterRecord[]
  favorites: string[]
  recentViews: string[]
  storageAvailable: boolean
  onPickCharacter: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function ProfilePage({
  characters,
  favorites,
  recentViews,
  storageAvailable,
  onPickCharacter,
  onToggleFavorite,
}: ProfilePageProps) {
  const favoriteItems = useMemo(() => {
    const map = new Map(characters.map((item) => [item.id, item]))
    return favorites.map((id) => map.get(id)).filter(Boolean) as CharacterRecord[]
  }, [characters, favorites])

  const recentItems = useMemo(() => {
    const map = new Map(characters.map((item) => [item.id, item]))
    return recentViews.map((id) => map.get(id)).filter(Boolean) as CharacterRecord[]
  }, [characters, recentViews])

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 md:px-8 lg:px-12">
      <header className="paper-panel p-5 md:p-6">
        <div className="section-kicker">个人空间</div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
          <div className="space-y-3">
            <h1 className="text-3xl text-[var(--ink-strong)] md:text-4xl">收藏与足迹</h1>
            <p className="max-w-[44rem] text-sm leading-8 text-[var(--ink-soft)] md:text-base">
              把喜欢的字收进你的口袋，随时回来继续探索。你的浏览足迹也会自动保留，方便再次打开同一段楚风记忆。
            </p>
          </div>
          {!storageAvailable ? (
            <div className="paper-panel bg-[color:var(--paper)] p-4">
              <div className="section-kicker">提示</div>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                当前环境无法保存到本地。你仍可浏览内容，但收藏与足迹不会在刷新后保留。
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="stat-block">
                <Sparkles className="h-4 w-4 text-[var(--accent-red)]" />
                <strong>{favorites.length}</strong>
                <span>我的收藏</span>
              </div>
              <div className="stat-block">
                <ScrollText className="h-4 w-4 text-[var(--accent-bronze)]" />
                <strong>{recentViews.length}</strong>
                <span>最近浏览</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="paper-panel p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="section-kicker">我的收藏</div>
              <h2 className="mt-3 text-2xl text-[var(--ink-strong)]">随手一收，随时再见</h2>
            </div>
          </div>

          {favoriteItems.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="paper-panel bg-[color:var(--paper)] flex items-center justify-between gap-4 p-4"
                >
                  <button
                    type="button"
                    onClick={() => onPickCharacter(item.id)}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                    aria-label={`打开收藏：${item.char}`}
                  >
                    <div className="collection-display text-4xl leading-none" style={{ color: item.accent }}>
                      {item.char}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs tracking-[0.24em] text-[var(--ink-muted)]">{item.category}</div>
                      <div className="mt-2 flex items-center gap-2 text-[var(--ink-strong)]">
                        <span className="truncate">{item.title}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent-red)]" />
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    aria-label={`取消收藏：${item.char}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] transition duration-300 hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]">
              你还没有收藏任何汉字。打开任意详情页，点一下“收藏”，这里就会出现你的私藏字集。
            </div>
          )}
        </article>

        <article className="paper-panel p-5 md:p-6">
          <div className="section-kicker">最近浏览</div>
          <h2 className="mt-3 text-2xl text-[var(--ink-strong)]">继续上一次的漫游</h2>

          {recentItems.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {recentItems.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPickCharacter(item.id)}
                  className="paper-panel bg-[color:var(--paper)] flex items-center gap-4 p-4 text-left transition hover:border-[var(--line-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                  aria-label={`打开最近浏览：${item.char}`}
                >
                  <div className="collection-display text-4xl leading-none" style={{ color: item.accent }}>
                    {item.char}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs tracking-[0.24em] text-[var(--ink-muted)]">{item.era}</div>
                    <div className="mt-2 flex items-center gap-2 text-[var(--ink-strong)]">
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent-red)]" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]">
              这里会记录你打开过的汉字。现在就去字库点开一张卡片，开始你的第一段足迹。
            </div>
          )}
        </article>
      </section>
    </main>
  )
}
