export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line-strong)] bg-[var(--paper-deep)] py-12 md:mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 md:px-8 lg:px-12">
        <div className="space-y-4">
          <div className="collection-display text-2xl tracking-widest text-[var(--ink-strong)]">
            <span className="hero-title-ink">荆楚</span>
            <span className="hero-title-brush text-[var(--accent-red)]">字</span>
            <span className="hero-title-seal">韵</span>
          </div>
          <p className="max-w-[24rem] text-sm leading-7 text-[var(--ink-soft)]">
            本平台致力于通过数字化技术，重塑荆楚文字的视觉表现，让历史文化在现代数字空间中焕发新的生命力。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:justify-items-end">
          <div className="space-y-4">
            <h3 className="tracking-[0.2em] text-[var(--ink-muted)]">文化矩阵</h3>
            <ul className="space-y-3 text-[var(--ink-soft)]">
              <li><span>荆楚青铜馆</span></li>
              <li><span>楚漆器数字展</span></li>
              <li><span>楚辞声音体验</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="tracking-[0.2em] text-[var(--ink-muted)]">联系我们</h3>
            <ul className="space-y-3 text-[var(--ink-soft)]">
              <li><span>机构合作</span></li>
              <li><span>文创授权</span></li>
              <li><span>意见反馈</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-xs text-[var(--ink-muted)] md:flex-row">
          <p>© 2026 数字荆楚文化发展中心. 保留所有权利.</p>
          <div className="flex gap-4">
            <span>隐私政策</span>
            <span>服务条款</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
