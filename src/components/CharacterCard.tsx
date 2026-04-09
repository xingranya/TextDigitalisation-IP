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
        boxShadow: '0 20px 48px color-mix(in oklab, var(--accent) 15%, transparent)' 
      }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.32), ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(character.id)}
      style={{ '--accent': character.accent } as CSSProperties}
      className={`collection-card group text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--paper)] ${featured ? 'lg:col-span-2' : ''}`}
      aria-label={`查看汉字详情：${character.char}，读音 ${character.pinyin}，类别：${character.category}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="section-kicker group-hover:text-[color:var(--accent)] transition-colors duration-300">{character.category}</div>
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--ink-muted)]">{character.era}</p>
            <h2 className="mt-2 text-xl text-[var(--ink-strong)] md:text-2xl transition-colors duration-300 group-hover:text-[color:color-mix(in_oklab,var(--accent)_60%,var(--ink-strong))]">{character.title}</h2>
          </div>
        </div>
        <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--accent)_26%,var(--line-strong))] bg-[color:color-mix(in_oklab,var(--accent)_7%,var(--paper-strong))] text-[var(--ink-soft)] group-hover:bg-[color:var(--accent)] group-hover:text-[var(--paper)] group-hover:border-[color:var(--accent)] transition-all duration-300 shadow-[0_0_12px_color-mix(in_oklab,var(--accent)_0%,transparent)] group-hover:shadow-[0_0_16px_color-mix(in_oklab,var(--accent)_20%,transparent)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:gap-6 grid-cols-[minmax(6.5rem,8.5rem)_minmax(0,1fr)] items-end">
        <div className="collection-display text-[5.5rem] leading-none text-[color:var(--accent)] md:text-[7.5rem] transition-transform duration-300 group-hover:scale-105 origin-bottom-left">
          {character.char}
        </div>
        <div className="space-y-3 pb-2">
          <p className="text-sm tracking-[0.22em] text-[var(--ink-muted)]">
            {character.pinyin}
          </p>
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
