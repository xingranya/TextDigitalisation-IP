import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CharacterRecord } from '../types/character'

interface CharacterCardProps {
  character: CharacterRecord
  index: number
  onSelect: (id: string) => void
}

export function CharacterCard({ character, index, onSelect }: CharacterCardProps) {
  const featured = character.featured || index % 7 === 0

  return (
    <motion.button
      type="button"
      layoutId={`card-${character.id}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -6, 
        boxShadow: '0 24px 64px color-mix(in oklab, var(--accent) 22%, transparent), inset 0 1px 0 color-mix(in oklab, white 75%, transparent)' 
      }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.32), ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(character.id)}
      style={{ '--accent': character.accent } as CSSProperties}
      className={`collection-card group text-left ${featured ? 'lg:col-span-2' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="section-kicker group-hover:text-[color:var(--accent)] transition-colors duration-300">{character.category}</div>
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--ink-muted)]">{character.era}</p>
            <h2 className="mt-2 text-xl text-[var(--ink-strong)] md:text-2xl transition-colors duration-300 group-hover:text-[color:color-mix(in_oklab,var(--accent)_60%,var(--ink-strong))]">{character.title}</h2>
          </div>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--accent)_26%,var(--line-strong))] bg-[color:color-mix(in_oklab,var(--accent)_7%,var(--paper-strong))] text-[var(--ink-soft)] group-hover:bg-[color:var(--accent)] group-hover:text-[var(--paper)] group-hover:border-[color:var(--accent)] transition-all duration-300 shadow-[0_0_12px_color-mix(in_oklab,var(--accent)_0%,transparent)] group-hover:shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_40%,transparent)]">
          <ArrowUpRight className="h-4 w-4 group-hover:animate-pulse" />
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(7.5rem,9rem)_minmax(0,1fr)] md:items-end">
        <motion.div
          layoutId={`glyph-${character.id}`}
          className="collection-display text-[6.5rem] leading-none text-[color:var(--accent)] md:text-[8rem] drop-shadow-sm group-hover:drop-shadow-[0_0_16px_color-mix(in_oklab,var(--accent)_35%,transparent)] transition-all duration-500 group-hover:scale-105 origin-bottom-left"
        >
          {character.char}
        </motion.div>
        <div className="space-y-3 pb-2">
          <motion.p
            layoutId={`pinyin-${character.id}`}
            className="text-sm tracking-[0.22em] text-[var(--ink-muted)]"
          >
            {character.pinyin}
          </motion.p>
          <p className="max-w-[34ch] text-sm leading-7 text-[var(--ink-soft)] md:text-[0.95rem]">
            {character.summary}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <span className="detail-chip">{character.motif}</span>
        {character.extensions.slice(0, 2).map((item) => (
          <span key={item.title} className="detail-chip">
            {item.title}
          </span>
        ))}
      </div>
    </motion.button>
  )
}
