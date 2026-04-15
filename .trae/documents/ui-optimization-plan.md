# UI 可优化点审计与实施计划

## 摘要

当前 UI 基础质量很高：主题变量（OKLCH + color-mix）、排版层级、动效节奏和组件分层都较成熟。可优化空间主要集中在可访问性语义补全、少量移动端布局细节、以及交互一致性（焦点回退、按钮语义/可点击性）这三个方向。本文给出可直接落地的改动清单，并将每组改动映射到适合的指令（/harden、/adapt、/polish、/optimize）。

## 当前状态分析（基于代码扫描）

- 技术栈：Vite + React + TS + Tailwind + Framer Motion（见 [package.json](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/package.json#L1-L34)）
- 主题与视觉系统：以 CSS 变量为核心（OKLCH、color-mix），并辅以少量组件类（见 [index.css](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/index.css#L7-L541)）
- 关键信息架构：
  - 入口页：搜索/关键词/统计侧栏（见 [SearchHero](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/SearchHero.tsx#L20-L150)）
  - 列表：瀑布/网格卡片（见 [App](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx#L159-L223)、[CharacterCard](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterCard.tsx#L12-L98)）
  - 详情：沉浸式对话框（见 [CharacterDetailModal](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L43-L398)）
  - AI 相关：底部 Sheet + 浮层入口 + 详情内导读（见 [AIChatSheet](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/AIChatSheet.tsx#L48-L327)、[AIFloatingLauncher](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/AIFloatingLauncher.tsx#L7-L96)、[CharacterAIGuide](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterAIGuide.tsx#L31-L200)）
- 已存在设计上下文：见 [.impeccable.md](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/.impeccable.md#L1-L20)

## 审计健康度（0-4）

| # | 维度 | 得分 | 关键发现 |
|---|---|---:|---|
| 1 | 可访问性 | 3 | 交互语义基本齐全，但缺少“选中态语义（aria-pressed/aria-current）”、弹层关闭后的焦点回退、以及少量按钮语义统一 |
| 2 | 性能 | 4 | 动效主要基于 transform/opacity；图片已 lazy；全局 reduced motion 已覆盖 |
| 3 | 响应式 | 3 | 主页面优秀；详情页内「相关推荐」3 列在窄屏下信息密度过高 |
| 4 | 主题化 | 4 | 变量系统完整且一致，避免硬编码色值；整体对比度策略合理 |
| 5 | 反模式 | 4 | 未发现侧边彩条/渐变文字/无意义玻璃态等典型 AI 痕迹 |
| **总分** |  | **18/20** | **Excellent（以可访问性与移动端细节为主的微调）** |

## 详细问题（按严重级别）

### P1（应在上线前修）

- **[P1] 分类筛选缺少“选中态语义”**
  - 位置：[CategoryRail.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CategoryRail.tsx#L10-L41)
  - 类别：Accessibility
  - 影响：读屏用户难以确认当前筛选项；也不利于自动化无障碍扫描通过率
  - 建议：为当前选中按钮增加 `aria-pressed={isActive}`（或改为 `role="tablist"`/`role="tab"` 并使用 `aria-selected`）；为容器增加更明确的 `aria-label`
  - 推荐指令：/harden

- **[P1] 弹层关闭后缺少焦点回退（返回触发点）**
  - 位置：[App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx#L159-L334)、[CharacterCard.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterCard.tsx#L20-L97)、[CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L43-L398)
  - 类别：Accessibility / Interaction
  - 影响：键盘用户打开详情后关闭，焦点可能回到 body，造成“迷路”；可访问性评测常见扣分项
  - 建议：在打开详情时记录触发按钮；关闭时 `focus()` 回触发按钮（或回到列表容器的稳定锚点）
  - 推荐指令：/harden

### P2（下一轮迭代修）

- **[P2] 详情页「相关推荐」窄屏三列导致可读性下降**
  - 位置：[CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L357-L383)
  - 类别：Responsive Design
  - 影响：移动端单个卡片宽度过小、标题易截断、触控目标紧凑；降低“继续探索”的转化
  - 建议：改为 `grid-cols-2 sm:grid-cols-3` 或窄屏横向滚动（配合滚动提示）；同时确保触控目标 ≥ 44px
  - 推荐指令：/adapt

- **[P2] Footer 中使用无行为的 button 作为链接项**
  - 位置：[Footer.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/Footer.tsx#L1-L45)
  - 类别：Accessibility / Anti-pattern（语义）
  - 影响：读屏会将其视为可操作控件，但实际无 onClick；也会让用户误以为可进入页面
  - 建议：若暂未实现跳转：改为文本（`span`）并弱化 hover；若应跳转：改为 `a` 并补充 `href`
  - 推荐指令：/harden（语义）+ /polish（交互细节）

- **[P2] 搜索结果播报语义可进一步完善**
  - 位置：[SearchHero.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/SearchHero.tsx#L80-L84)
  - 类别：Accessibility
  - 影响：当前使用 `sr-only + aria-live` 是正确方向，但文案与触发节奏可更贴近读屏习惯（例如仅在值变化时播报；避免“没有结果”反复播报）
  - 建议：将播报节点提取为稳定区域，并在 query 变化/结果变化时更新；或增加 `aria-atomic="true"`
  - 推荐指令：/harden

### P3（可选抛光）

- **[P3] 交互焦点样式重复声明（可维护性）**
  - 位置：多个组件内的 `focus-visible:*` 重复（如 [SearchHero.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/SearchHero.tsx#L64-L104)、[AIChatSheet.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/AIChatSheet.tsx#L232-L290)）
  - 类别：Anti-pattern（实现层面）
  - 影响：后续想统一调整焦点样式，需要改动多处
  - 建议：把“常用焦点环”收敛到少量可复用 class（在 `@layer components` 内提供），并在组件中替换为统一类名
  - 推荐指令：/polish 或 /normalize

- **[P3] 搜索输入 debounce 的 timeout 未在卸载时清理**
  - 位置：[App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx#L121-L134)
  - 类别：Performance（轻微）
  - 影响：极端情况下会在卸载后触发 setState（概率低，但属于可修的边角）
  - 建议：在 `useEffect` cleanup 里清理 timeout 或改为受控的 debounced hook
  - 推荐指令：/optimize

## 拟改动清单（文件级）

### 1) 增强无障碍语义（/harden）

- [CategoryRail.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CategoryRail.tsx)：为激活项补齐 `aria-pressed`/`aria-current`；为容器补充可读的 `aria-label`
- [App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx)：记录详情弹层触发元素引用；关闭弹层时做焦点回退
- [Footer.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/Footer.tsx)：将“无行为按钮”调整为文本或链接（取决于是否有真实落地页面）
- [SearchHero.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/SearchHero.tsx)：强化 `aria-live` 区域的更新策略（减少重复播报）

### 2) 移动端阅读体验（/adapt）

- [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx)：调整「相关推荐」布局与触控目标尺寸；必要时改为横向滚动容器并保留键盘可达

### 3) 代码层抛光与一致性（/polish）

- [index.css](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/index.css)：沉淀少量可复用的交互类（例如统一的 focus ring / icon button / chip）
- 多组件：用统一 class 替代重复的 `focus-visible:outline-*` 组合，减少维护成本

### 4) 轻量性能边角（/optimize）

- [App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx)：为 debounce timeout 增加卸载清理，避免潜在 setState after unmount

## 关键假设与待确认（仅影响少量实现细节）

- Footer 的「文化矩阵/联系我们/隐私政策/服务条款」是否应该可点击跳转？
  - 若有真实落地 URL：用 `a href`（外链/站内路由）替换现有 `button`
  - 若暂无落地：改为不可点击文本，并移除 hover 交互（避免误导）

## 验证步骤（不涉及启动命令）

- 键盘可达性：Tab 顺序可预测；打开/关闭详情弹层后焦点回到触发卡片；AI Sheet 打开/关闭后焦点回到入口按钮
- 读屏语义：分类筛选能读出“已选中”；搜索结果播报在结果变化时准确触发
- 移动端布局：详情页「相关推荐」在 360–430px 宽度下可读、可点、无横向溢出

## 推荐执行顺序（指令）

1. **[P1] /harden** — 补齐 aria 语义 + 焦点回退 + Footer 语义修正
2. **[P2] /adapt** — 详情页移动端「相关推荐」布局与触控目标优化
3. **[P3] /optimize** — debounce cleanup 等轻量边角
4. **[P3] /polish** — 收敛重复交互样式与组件一致性抛光

