export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line-strong)] bg-[var(--paper-deep)] py-12 md:mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-2 md:px-8 lg:px-12">
        <div className="space-y-4">
          <div className="collection-display text-2xl tracking-widest text-[var(--ink-strong)]">
            荆楚字韵
          </div>
          <p className="max-w-[24rem] text-sm leading-7 text-[var(--ink-soft)]">
            本平台致力于通过数字化技术，重塑荆楚文字的视觉表现，让历史文化在现代数字空间中焕发新的生命力。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:justify-items-end">
          <div className="space-y-4">
            <h3 className="tracking-[0.2em] text-[var(--ink-muted)]">文化矩阵</h3>
            <ul className="space-y-3 text-[var(--ink-soft)]">
              <li><button className="hover:text-[var(--accent-red)]">荆楚青铜馆</button></li>
              <li><button className="hover:text-[var(--accent-red)]">楚漆器数字展</button></li>
              <li><button className="hover:text-[var(--accent-red)]">楚辞声音体验</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="tracking-[0.2em] text-[var(--ink-muted)]">联系我们</h3>
            <ul className="space-y-3 text-[var(--ink-soft)]">
              <li><button className="hover:text-[var(--accent-red)]">机构合作</button></li>
              <li><button className="hover:text-[var(--accent-red)]">文创授权</button></li>
              <li><button className="hover:text-[var(--accent-red)]">意见反馈</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-xs text-[var(--ink-muted)] md:flex-row">
          <p>© 2026 数字荆楚文化发展中心. 保留所有权利.</p>
          <div className="flex gap-4">
            <button className="hover:text-[var(--ink-strong)]">隐私政策</button>
            <button className="hover:text-[var(--ink-strong)]">服务条款</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
