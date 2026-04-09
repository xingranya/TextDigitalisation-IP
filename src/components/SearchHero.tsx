import { Compass, LibraryBig, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchHeroProps {
  query: string
  total: number
  filteredTotal: number
  keywordSuggestions: string[]
  onQueryChange: (value: string) => void
  onKeywordSelect: (value: string) => void
}

const revealTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
}

export function SearchHero({
  query,
  total,
  filteredTotal,
  keywordSuggestions,
  onQueryChange,
  onKeywordSelect,
}: SearchHeroProps) {
  return (
    <header className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-12 pt-8 md:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] lg:gap-12 lg:px-12 lg:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={revealTransition}
        className="space-y-8"
      >
        <div className="space-y-4">
          <div className="section-kicker">数字荆楚·字韵游园</div>
          <div className="max-w-4xl space-y-5">
            <h1 className="collection-display text-[clamp(3.4rem,8vw,7.6rem)] leading-[0.92] tracking-[0.08em] text-[var(--ink-strong)]">
              荆楚<span className="text-[var(--accent-red)]">字</span>韵
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)] md:text-lg">
              探索楚地两千年的浪漫与瑰丽。扫码进入这片云梦大泽，每一笔画皆是青铜与漆木的低语。
            </p>
          </div>
        </div>

        <div className="paper-panel space-y-4 p-4 md:p-5">
          <label className="text-sm tracking-[0.28em] text-[var(--ink-muted)]" htmlFor="character-search">
            探寻楚迹
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              id="character-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="w-full rounded-[1.35rem] border border-[var(--line-strong)] bg-[color:var(--paper-strong)] px-12 py-4 text-base text-[var(--ink-strong)] outline-none transition duration-300 placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-red)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-red)_10%,transparent)]"
              placeholder="输入汉字或拼音，寻找你的楚地印记"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                className="keyword-chip"
                onClick={() => onKeywordSelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...revealTransition, delay: 0.12 }}
        className="paper-panel flex flex-col gap-5 p-5 md:p-6"
      >
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className="stat-block">
            <LibraryBig className="h-4 w-4 text-[var(--accent-red)]" />
            <strong>{total}</strong>
            <span>已收录楚印</span>
          </div>
          <div className="stat-block">
            <Sparkles className="h-4 w-4 text-[var(--accent-bronze)]" />
            <strong>{filteredTotal}</strong>
            <span>当前可浏览</span>
          </div>
          <div className="stat-block">
            <Compass className="h-4 w-4 text-[var(--accent-green)]" />
            <strong>扫码探秘</strong>
            <span>适配导览场景</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          <div className="space-y-2">
            <h2 className="text-sm tracking-[0.24em] text-[var(--ink-muted)]">青铜之光</h2>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              聆听曾侯乙编钟的回响，感受楚地金属冶炼的卓越与力量。
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm tracking-[0.24em] text-[var(--ink-muted)]">漆木之韵</h2>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              红黑交织的色彩中，藏着荆楚先民浪漫奔放的神话想象。
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm tracking-[0.24em] text-[var(--ink-muted)]">辞赋之美</h2>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              翻开楚简，在离骚的字里行间，触摸屈子傲骨与诗性光芒。
            </p>
          </div>
        </div>
      </motion.aside>
    </header>
  )
}
