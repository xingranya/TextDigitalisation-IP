import type { CSSProperties } from 'react'
import { MapPinned, Sparkles, X, Volume2, Share2, Box, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { CharacterRecord } from '../types/character'
import { jingchuCharacters } from '../data/characters'

interface CharacterDetailModalProps {
  character: CharacterRecord
  onClose: () => void
  onSelect: (id: string) => void
}

function ImageWithSkeleton({ src, alt, accentColor }: { src: string, alt: string, accentColor: string }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl bg-[color:color-mix(in_oklab,var(--accent)_10%,var(--paper))]" 
      style={{ aspectRatio: '1/1', '--accent': accentColor } as CSSProperties}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 animate-pulse bg-[color:color-mix(in_oklab,var(--accent)_15%,var(--paper))]"
          />
        )}
      </AnimatePresence>
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
export function CharacterDetailModal({
  character,
  onClose,
  onSelect,
}: CharacterDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isTextLong = character.description.length > 120
  const hasImage = Boolean(character.images && character.images.length > 0)
  const rawRotation = character.rotation ?? 0
  const rotation = hasImage ? 0 : Math.max(-2, Math.min(2, rawRotation))
  const rawScale = character.scale ?? 1
  const scale = hasImage ? 1 : Math.max(0.92, Math.min(1.1, rawScale))
  // Get 3 related characters (same category or just fallback to some featured ones)
  const related = jingchuCharacters
    .filter((item) => item.id !== character.id && item.category === character.category)
    .slice(0, 3)

  if (related.length < 3) {
    const fallbacks = jingchuCharacters.filter(item => item.id !== character.id && !related.find(r => r.id === item.id)).slice(0, 3 - related.length)
    related.push(...fallbacks)
  }
  return (
    <>
      <motion.button
        type="button"
        aria-label="关闭详情"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[color:color-mix(in_oklab,var(--ink-strong)_40%,transparent)]"
      />

      <div className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-3 pt-10 md:items-center md:p-6">
        <motion.section
          layoutId={`card-${character.id}`}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ '--accent': character.accent } as CSSProperties}
          className="detail-modal detail-scroll max-h-[92vh] w-full max-w-6xl overflow-y-auto bg-[var(--paper-strong)]"
        >
          <div className="grid min-h-full gap-0 lg:grid-cols-[minmax(20rem,0.94fr)_minmax(0,1.06fr)]">
            <div className="detail-stage">
              <div className="space-y-5">
                <div className="section-kicker text-[color:color-mix(in_oklab,var(--paper)_72%,transparent)]">
                  {character.category}
                </div>
                <div className="collection-display text-[7rem] leading-none text-[color:var(--paper)] md:text-[11rem] flex items-center justify-start">
                  {character.images && character.images.length > 0 ? (
                    <div className="ip-char-hero-frame">
                      <img
                        src={character.images[0]}
                        alt={`${character.char} 艺术字`}
                        loading="lazy"
                        style={{
                          transform: `rotate(${rotation}deg) scale(${scale})`,
                          transformOrigin: '50% 50%',
                        }}
                        className="ip-char-hero-image"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        fontFamily: character.fontFamily || 'inherit',
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                        transformOrigin: '50% 60%',
                        fontWeight: character.fontWeight || 'normal',
                        fontStyle: character.italic ? 'italic' : 'normal',
                      }}
                    >
                      {character.char}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm tracking-[0.4em] text-[color:color-mix(in_oklab,var(--paper)_75%,transparent)]" aria-label={`拼音: ${character.pinyin}`}>
                    {character.pinyin}
                  </p>
                  <button 
                    type="button" 
                    aria-label="播放读音" 
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--paper)_20%,transparent)] bg-[color:color-mix(in_oklab,var(--paper)_10%,transparent)] text-[var(--paper)] transition hover:bg-[color:color-mix(in_oklab,var(--paper)_20%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--paper)]"
                  >
                    <Volume2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm tracking-[0.18em] text-[color:color-mix(in_oklab,var(--paper)_72%,transparent)]">
                  <MapPinned className="h-4 w-4" />
                  <span>{character.era}</span>
                </div>
                <p className="max-w-[30ch] text-sm leading-7 text-[color:color-mix(in_oklab,var(--paper)_82%,transparent)] md:text-base">
                  {character.quote}
                </p>
              </div>
            </div>

            <div className="relative flex flex-col gap-8 bg-[var(--paper-strong)] p-5 pb-20 md:p-8 lg:p-10 lg:pb-10">
              <div className="absolute right-4 top-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  aria-label="分享"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] transition duration-300 hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <Share2 aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="关闭详情"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] transition duration-300 hover:border-[var(--accent-red)] hover:text-[var(--ink-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="space-y-4 pr-12"
              >
                <div className="section-kicker">字形详情</div>
                <div>
                  <h2 className="text-3xl text-[var(--ink-strong)] md:text-4xl">{character.title}</h2>
                  <p className="mt-3 text-base leading-8 text-[var(--ink-soft)]">{character.summary}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="paper-panel p-4 hover:border-[color:var(--accent)] transition-colors duration-300">
                  <div className="section-kicker">文化母题</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{character.motif}</p>
                </div>
                <div className="paper-panel p-4 hover:border-[color:var(--accent)] transition-colors duration-300">
                  <div className="section-kicker">短摘要</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{character.summary}</p>
                </div>
                <div className="paper-panel p-4 hover:border-[color:var(--accent)] transition-colors duration-300 md:col-span-2">
                  <div className="section-kicker">适合场景</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    适合景区扫码导览、数字展览页、城市伴手礼、电商文创详情页等场景。
                  </p>
                </div>
              </motion.div>

              <motion.article 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="space-y-4"
              >
                <div className="section-kicker">文化介绍</div>
                <div className="relative">
                  <div className={`max-w-[42rem] text-base leading-8 text-[var(--ink-soft)] whitespace-pre-line transition-all duration-300 ${!isExpanded && isTextLong ? 'line-clamp-6' : ''}`}>
                    {character.description}
                  </div>
                  {!isExpanded && isTextLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--paper-strong)] to-transparent" />
                  )}
                </div>
                {isTextLong && (
                  <button 
                    type="button" 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-medium tracking-widest text-[color:var(--accent)] hover:text-[color:color-mix(in_oklab,var(--accent)_60%,var(--ink-strong))] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {isExpanded ? '收起内容' : '阅读更多'}
                  </button>
                )}
              </motion.article>

              <motion.section 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-[var(--ink-muted)]">
                  <Sparkles className="h-4 w-4 text-[var(--accent-red)]" />
                  <span>延展文创与互动体验</span>
                </div>

                {/* 3D/AR Placeholder */}
                <button 
                  type="button" 
                  aria-label="进入 3D 沉浸空间" 
                  className="w-full relative overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[color:color-mix(in_oklab,var(--paper)_40%,white)] p-6 md:p-8 flex flex-col items-center justify-center min-h-[16rem] text-center group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[color:color-mix(in_oklab,var(--accent)_8%,transparent)] to-transparent opacity-50 group-hover:opacity-100 transition duration-500" />
                  <Box aria-hidden="true" className="h-12 w-12 text-[color:var(--accent)] mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium text-[var(--ink-strong)] mb-2">3D 数字文物 / AR 互动</h3>
                  <p className="text-sm text-[var(--ink-soft)] max-w-sm">
                    点击进入沉浸式空间，全方位观赏相关荆楚文物模型，或使用 AR 投影至现实环境。
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs tracking-widest text-[color:var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_10%,transparent)] px-4 py-2 rounded-full font-bold uppercase group-hover:bg-[color:color-mix(in_oklab,var(--accent)_20%,transparent)] transition">
                    立即体验 <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  </span>
                </button>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {character.extensions.map((item) => (
                    <article key={item.title} className="extension-tile">
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>

                {character.images && character.images.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-8 space-y-4"
                  >
                    <h4 className="text-sm font-medium tracking-widest text-[color:var(--accent)] uppercase">相关文创图集</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {character.images.slice(1).map((img, i) => (
                        <ImageWithSkeleton key={i} src={img} alt={`${character.char} 相关文创 ${i+1}`} accentColor={character.accent} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.section>

              {/* 相关推荐 */}
              <motion.section 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="mt-8 space-y-5 border-t border-[var(--line-strong)] pt-8"
              >
                <div className="section-kicker">相关推荐</div>
                <div className="grid gap-4 grid-cols-3">
                  {related.map(item => (
                    <button 
                      type="button"
                      key={item.id} 
                      onClick={() => onSelect(item.id)}
                      aria-label={`查看相关汉字推荐：${item.char}`}
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--accent-red)] transition cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                    >
                      <div className="text-4xl font-serif text-[var(--ink-strong)] group-hover:text-[var(--accent-red)] transition">
                        {item.char}
                      </div>
                      <div className="text-xs tracking-widest text-[var(--ink-muted)]">
                        {item.title}
                      </div>
                    </button>
                  ))}
                </div>
                </motion.section>

                <div className="flex flex-wrap gap-2">
                {character.searchTokens.map((token) => (
                  <span key={token} className="detail-chip">
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  )
}
