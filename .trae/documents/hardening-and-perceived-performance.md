# 荆楚文字 IP 库第三阶段优化计划 (Plan)

## Summary (项目概况)
用户希望继续查找项目中可优化的地方。通过前期的排版和动画降级，目前页面在各端的渲染帧率已经恢复正常。接下来的优化将集中在**资源加载感知性能 (Perceived Performance)**、**边缘情况健壮性 (Hardening)** 以及**极致字体加载策略 (Typography & FOUT prevention)** 上。

本次计划将通过 `harden` (边缘情况处理) 和 `optimize` (感知性能与加载策略) 技能，将项目打磨至真正的 Production-Ready (生产级) 状态。

## Current State Analysis (现状分析)
1. **图片加载与 CLS 问题**: `CharacterDetailModal` 中的“延伸文创 IP”图片 (来源于 `mock.ts` 的外部链接) 在网络较慢时会出现白屏闪烁，并在图片加载完成后导致布局偏移 (CLS)。
2. **中文字体加载策略**: 目前 `index.css` 仅引用了系统默认的 `serif`。如果未来接入类似 `Noto Serif SC` 这样的 Web Font，默认的 `font-display: swap` 会导致字形在加载前后发生突变（FOUT），这对于强调“文字即艺术”的数字画廊是不可接受的。
3. **边缘情况缺失**: 
   - 搜索框在连续输入或粘贴大段无关特殊字符时，缺乏防抖（Debounce）处理。
   - 长文本（如 `description`）若内容过多会无限制拉长详情页。
   - 在景区（如博物馆深处）网络信号不好时，用户没有任何提示。

## Proposed Changes (改进方案)

### 1. 图片骨架屏与 CLS 优化 (Performance)
- **目标文件**: `src/components/CharacterDetailModal.tsx`
- **改动说明**:
  - 重构“延伸文创 IP”的图片渲染逻辑，引入一个带有 `aspect-ratio` 和纯色占位（基于该字的 `accent` 色）的容器。
  - 为 `<img>` 标签添加 `loading="lazy"`。
  - 监听 `onLoad` 事件，在图片加载完成前显示骨架屏动画（Pulse），加载后平滑淡入图片，彻底消除布局偏移（CLS）。

### 2. 核心艺术字加载策略 (Typography Optimization)
- **目标文件**: `src/index.css`, `index.html` (如果有 Web Font)
- **改动说明**:
  - 用户明确选择了 **FOIT (等待完美字体)** 策略。
  - 我们将在 CSS 中配置字体加载行为，或者在 React 顶层（如果有真实 Web Font）添加一个全局的加载动画。由于当前未实际引入上 MB 的中文字体文件，我们将通过 CSS 预先定义好严格的 Fallback 链（优先匹配 `Noto Serif SC`, `STSong`, `SimSun`），并在 `collection-display` 类上添加 `font-display: block`（优先等待字体，隐藏文本，避免丑陋的字体闪烁）。

### 3. 边缘情况处理 (Hardening)
- **目标文件**: `src/components/SearchHero.tsx`, `src/App.tsx`, `src/components/CharacterDetailModal.tsx`
- **改动说明**:
  - **搜索防抖与过滤**: 在 `SearchHero` 的 `onChange` 中加入简单的防抖（例如 300ms），并在向上传递时过滤掉极端的特殊字符。
  - **断网提示 (Offline State)**: 在 `App.tsx` 中使用 `navigator.onLine` 和 `window.addEventListener('offline')` 监听网络状态。当网络断开时，在页面顶部或弹出一个 Toast 提示：“网络已断开，您正在查看本地缓存的导览数据”。
  - **长文本折叠**: 在 `CharacterDetailModal` 的“文化介绍”部分，如果文本过长，默认使用 `line-clamp-4` 进行截断，并提供一个“阅读更多”的展开按钮。

## Assumptions & Decisions (假设与决策)
- **决策**: 针对图片占位，不使用繁重的第三方库（如 `react-loading-skeleton`），而是利用 Tailwind 已有的 `animate-pulse` 和背景色混合直接手写一个极轻量的骨架屏组件，以保持 Bundle Size 最小化。
- **决策**: 搜索防抖由于目前是纯前端过滤（数据全在内存中，没有 API 请求），实际上性能影响不大，但为了遵循生产级规范，依然会加入一个轻量的自定义 `useDebounce` Hook 或在状态层做延迟处理。

## Verification Steps (验证步骤)
1. 打开浏览器 DevTools -> Network，将网速切换为 `Slow 3G`。
2. 点击任意包含“延伸文创”的汉字卡片，验证图片区域是否首先展示了一个带动画的纯色骨架屏，且在图片慢慢加载出来时，页面布局没有发生任何跳动（CLS 为 0）。
3. 在浏览器的 Network 面板中勾选 `Offline`，验证页面上方是否弹出了“网络已断开”的提示。
4. 验证详情页中的大段“文化介绍”文字是否被默认截断为 4 行，且点击“阅读更多”后能平滑展开。