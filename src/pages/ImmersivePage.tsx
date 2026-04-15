import { ArrowRight, Box, Sparkles } from 'lucide-react'
import type { CharacterRecord } from '../types/character'

export function ImmersivePage({
  characters,
  activeId,
  onBackHome,
  onOpenCharacter,
}: {
  characters: CharacterRecord[]
  activeId: string | null
  onBackHome: () => void
  onOpenCharacter: (id: string) => void
}) {
  const active = activeId ? characters.find((item) => item.id === activeId) ?? null : null

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 md:px-8 lg:px-12">
      <header className="paper-panel p-5 md:p-6">
        <div className="section-kicker">沉浸空间</div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)]">
          <div className="space-y-3">
            <h1 className="text-3xl text-[var(--ink-strong)] md:text-4xl">让文物从字里走出来</h1>
            <p className="max-w-[46rem] text-sm leading-8 text-[var(--ink-soft)] md:text-base">
              这里将承接 3D 文物、AR 投影与空间化音画叙事。你可以先把它当作一间“数字展厅入口”，在后续接入真实模型前，了解体验结构与浏览方式。
            </p>
          </div>
          <div className="paper-panel bg-[color:var(--paper)] p-4">
            <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-[var(--ink-muted)]">
              <Sparkles className="h-4 w-4 text-[var(--accent-bronze)]" />
              <span>接入策略</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
              <li>模型资源按需加载，弱网优先展示图集与解读。</li>
              <li>低性能设备自动切换为静态导览，不影响阅读。</li>
              <li>所有互动入口保持可回退，不制造“死胡同”。</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)]">
        <article className="paper-panel p-5 md:p-6">
          <div className="section-kicker">体验结构</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                title: '展品出场',
                desc: '以一件核心文物为主视角，配合笔画细节与母题纹样，建立观看线索。',
              },
              {
                title: '空间漫游',
                desc: '通过轻量交互查看纹样、工艺与年代，让每次点击都能学到一条信息。',
              },
              {
                title: '声音与文字',
                desc: '读音、引语与简短旁白组成“可听的说明牌”，让导览更像在展厅行走。',
              },
              {
                title: '带走一件',
                desc: '把展品的关键纹样转化为文创提案：印章、贴纸、导视、包装等可落地物。',
              },
            ].map((item) => (
              <div key={item.title} className="paper-panel bg-[color:var(--paper)] p-4">
                <h2 className="text-lg text-[var(--ink-strong)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="paper-panel p-5 md:p-6">
          <div className="flex items-center gap-2 text-sm tracking-[0.2em] text-[var(--ink-muted)]">
            <Box className="h-4 w-4 text-[var(--accent-red)]" />
            <span>与之关联</span>
          </div>

          {active ? (
            <div className="mt-4 space-y-4">
              <div className="paper-panel bg-[color:var(--paper)] p-4">
                <div className="text-xs tracking-[0.24em] text-[var(--ink-muted)]">{active.category}</div>
                <div className="mt-3 flex items-end gap-3">
                  <div className="collection-display text-5xl leading-none" style={{ color: active.accent }}>
                    {active.char}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[var(--ink-strong)]">{active.title}</div>
                    <div className="mt-2 text-sm tracking-[0.22em] text-[var(--ink-muted)]">{active.pinyin}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{active.motif}</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenCharacter(active.id)}
                className="ai-entry-chip w-full justify-center"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                回到该字详情
              </button>
              <button type="button" onClick={onBackHome} className="keyword-chip w-full justify-center">
                返回字库
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-4 text-sm leading-7 text-[var(--ink-soft)]">
                请选择一个汉字进入沉浸空间。你可以先回到字库，从任意卡片的详情页进入这里。
              </div>
              <button type="button" onClick={onBackHome} className="keyword-chip w-full justify-center">
                返回字库
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

