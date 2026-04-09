# 荆楚文字 IP 库性能与排版优化计划 (Plan)

## Summary (项目概况)
用户反馈在手机端打开页面存在严重的卡顿（特别是卡片展开为详情弹窗、缩小恢复时的 Framer Motion 动画），同时手机端和电脑端的排版适配（Responsive Design）不理想。

本次计划将通过 `optimize` (性能优化)、`adapt` (响应式适配) 和 `arrange` (排版重组) 技能，彻底解决动画性能瓶颈，并针对移动端（紧凑内容优先）与桌面端（宽屏张力分栏）进行彻底的排版重构。

## Current State Analysis (现状分析)
1. **性能卡顿 (Performance)**: 
   - **动画卡顿主因**: 当前 `CharacterDetailModal` 的展开与收起使用了大量的 `layoutId` 共享元素动画，且弹窗背后附加了昂贵的 `backdrop-blur-sm` 滤镜；卡片自身使用了多层 CSS 径向渐变 (`radial-gradient`) 和重度阴影 (`box-shadow`)。在移动端 GPU 上，对这类包含滤镜和复杂背景的 DOM 节点进行高频 Layout 动画会导致灾难性的重绘（Repaint）与掉帧。
2. **移动端排版 (Mobile Layout)**:
   - 顶部 `SearchHero` 组件占据了过多的竖向空间（大标题、介绍段落、搜索框、三个统计卡片、三大脉络介绍），导致用户在手机上需要滑动几屏才能看到真正的文字卡片。这违背了移动端“寸土寸金”的原则。
3. **桌面端排版 (Desktop Layout)**:
   - 当前在超宽屏下，虽然 `SearchHero` 设置了 `grid-cols`，但整体视觉不够有张力，存在大量无意义的留白。文字卡片的列数（最多3列）在 4K 屏幕下显得过大且笨重。

## Proposed Changes (改进方案)

### 1. 彻底解决展开/缩小动画卡顿 (Optimize)
- **目标文件**: `src/components/CharacterDetailModal.tsx`, `src/index.css`, `src/components/CharacterCard.tsx`
- **改动说明**:
  - **移除昂贵的背景滤镜**: 移除模态框遮罩层的 `backdrop-blur-sm`，替换为纯色的半透明遮罩（如 `bg-black/60` 或使用 `color-mix` 的纯色），极大降低 GPU 渲染压力。
  - **降级过度复杂的 CSS 阴影**: 减少 `CharacterCard` 悬停和展开状态下的高斯模糊扩散范围，将多层 `box-shadow` 简化为单层。
  - **动画属性优化**: 确保 Framer Motion 只对 `transform` 和 `opacity` 属性进行补间动画。对于不需要做 `layoutId` 平滑过渡的元素（如详细介绍文字、相关推荐），改用普通的 `FadeIn`，减轻 React 重算节点位置的开销。
  - **限制卡片背景的重绘**: 将卡片的网格噪点背景 (`::before`) 设为静态不随卡片缩放而触发重绘。

### 2. 移动端首屏“紧凑型：内容优先”适配 (Adapt - Mobile)
- **目标文件**: `src/components/SearchHero.tsx`
- **改动说明**:
  - 利用 Tailwind 的响应式前缀（如 `hidden md:block`），在移动端隐藏次要的“三大脉络”文字介绍和“三个统计卡片”。
  - 缩减移动端 Hero 区的标题大小和上下 `padding`。
  - 确保移动端用户首屏就能直接看到搜索框、分类标签以及第一排的汉字卡片。

### 3. 桌面端“宽屏张力分栏”重构 (Arrange - Desktop)
- **目标文件**: `src/components/SearchHero.tsx`, `src/App.tsx`
- **改动说明**:
  - 重新设计 `SearchHero`：左侧放置极其夸张的大标题和搜索框，右侧（通过 Grid 分栏）放置精简后的数据统计和文化引言。
  - **多列扩展**: 在 `App.tsx` 中的 `<main>` 区域，将网格系统修改为 `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`，以充分利用宽屏显示器的横向空间，让排版更加致密且有规律。

## Assumptions & Decisions (假设与决策)
- **决策**: 性能优先于极致的视觉特效。在移动端由于算力有限，去除模糊滤镜和多层投影是解决动画掉帧最有效的方法。如果需要，我们可以在桌面端保留部分光影特效，而在移动端做降级（使用 `@media (max-width: 768px)` 移除滤镜）。
- **假设**: 由于目前总字数（24个）不多，尚不需要引入重量级的 Virtual Scrolling（虚拟列表）库。卡顿的核心在于 Framer Motion 的 `layout` 动画在执行复杂 CSS 滤镜时的性能消耗。

## Verification Steps (验证步骤)
1. **动画流畅度**: 点击任意卡片，观察弹窗放大与缩小时是否依然有肉眼可见的掉帧。检查弹窗背后的遮罩是否已去掉毛玻璃效果（Blur）。
2. **移动端排版**: 调整浏览器宽度至手机尺寸（<768px），验证首屏是否被大幅精简，确保统计区块被隐藏，用户能立刻看到搜索框和下方的卡片。
3. **桌面端排版**: 调整浏览器至宽屏（>1280px），验证 Hero 区域是否呈现左右分栏的张力布局，且下方的卡片网格是否增加到了 4 列。