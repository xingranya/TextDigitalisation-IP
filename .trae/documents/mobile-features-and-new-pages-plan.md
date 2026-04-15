# 移动端未实现功能 + 新增页面实施计划

## 摘要

在不引入新依赖（不使用 react-router）的前提下，为当前 SPA 增加“页面级导航”，补齐移动端底部导航中尚未实现的「文创」「我的」入口，并把详情弹层中未落地的关键动作（分享、播放读音、3D/AR 入口）实现为可用的移动端体验闭环。新增页面遵循现有“数字美术馆/纸本展陈”视觉体系与交互节奏（见 [.impeccable.md](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/.impeccable.md#L1-L20)、[index.css](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/index.css#L7-L541)）。

## 当前状态分析（基于仓库扫描）

- 项目为单页应用：入口 [main.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/main.tsx#L1-L10)，页面状态集中在 [App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx#L25-L378)。
- 已有 URL 状态同步：仅支持 `q/cat/char`（见 [url-state.ts](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/lib/url-state.ts#L1-L36)），未包含“页面”概念。
- 移动端底部导航：`文创/我的` 仍为 toast 占位（见 [MobileTabBar.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/MobileTabBar.tsx#L38-L55)）。
- 详情弹层存在未落地交互：
  - 分享按钮无行为（见 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L209-L227)）
  - 播放读音按钮无行为（见 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L184-L195)）
  - 3D/AR 区域为占位（见 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L314-L329)）
- 数据侧：每个字包含 `extensions / searchTokens / images` 等结构，可用于构建“文创/延展”内容（见 [character.ts](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/types/character.ts#L1-L28)、[characters.ts](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/data/characters.ts#L1-L120)）。

## 目标与成功标准

- **移动端导航可用**：底部 Tab 的「字库 / 问AI / 文创 / 我的」均可进入对应页面；当前页面有明确选中态。
- **详情动作闭环**：
  - “分享”在支持 Web Share 的设备上直接调起系统分享；不支持时复制链接并提示成功。
  - “播放读音”在无音频资源的情况下仍可发声（采用浏览器 SpeechSynthesis），且可停止/重复播放。
  - “3D/AR”入口不再是空按钮：进入独立页面展示“沉浸空间”概念说明与后续接入策略（可作为真正 WebGL/AR 的落点）。
- **新增页面具备真实可用的信息架构**：不是“开发中/即将上线”占位文案；即便内容为模拟，也要像可上线产品一样有用。
- **不破坏现有深链接**：`?q=&cat=&char=` 仍可恢复到当前筛选与详情状态；新增 `page` 参数后兼容旧链接。

## 设计简报（/shape 产出，落地到本次实现）

### Feature Summary
为移动端提供“可连续探索”的多页面体验：从字库→详情→文创延展→个人收藏/足迹，并允许从任何环节快速回到主探索流。

### Primary User Action
在移动端快速找到感兴趣的字，并把“喜欢/想带走”的内容收藏或分享出去。

### Layout Strategy
延续“画廊式留白 + 纸面 panel”，页面采用顶部标题区（kicker + 标题 + 简短说明）+ 内容区（卡片/列表）+ 底部 Tab 的三段结构；在视觉上让“字形/内容”始终优先于 UI。

### Key States
默认态 / 空态（无收藏、无足迹、无可用延展）/ 交互态（toast、复制成功、分享失败）/ 降级态（不支持 Web Share、speechSynthesis）。

## 方案与范围（决策已锁定）

- 路由方式：**不新增依赖**，基于 URLSearchParams 增加 `page` 参数（`home | shop | profile | immersive`）。
- 页面可在桌面端访问，但主要为移动端优化；桌面端保持现有首页布局不受影响。
- 用户侧数据：使用 `localStorage` 持久化（收藏列表、最近浏览），不引入后端。

## 拟新增/改动的模块与文件（落地级别）

### 1) 增加页面状态（URL + 内部状态）

- 修改 [src/lib/url-state.ts](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/lib/url-state.ts#L1-L36)
  - 扩展 `BrowserState`：新增 `page: 'home' | 'shop' | 'profile' | 'immersive'`
  - `readBrowserState()`：读取 `page`，默认 `home`
  - `writeBrowserState()`：写入 `page`（仅当非 home 时写入，保持链接简洁）
  - 兼容策略：旧链接无 `page` 时按 home 处理；仍能恢复 `q/cat/char`

- 修改 [src/App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx#L25-L378)
  - 新增 `activePage` 状态（来自 `readBrowserState()`），并在 `writeBrowserState()` 同步
  - 抽象 `navigate(page)`：切换页面并处理必要的 UI 状态（关闭详情/AI sheet、恢复滚动等）
  - 首页内容（SearchHero/CategoryRail/字卡网格/介绍区）仅在 `page === 'home'` 渲染

### 2) 新增页面组件（src/pages）

- 新增 `src/pages/ShopPage.tsx`
  - 内容结构：
    - “文创提案”标题区：解释“延展文创”的含义与可用场景
    - 基于 `characters[].extensions` 聚合出“文创方向”列表（按 extension.title 分组），每组显示若干相关字作为“灵感入口”
    - 提供“按类别/母题”轻筛选（复用已有 category 数据与 chip 风格）
  - 交互：
    - 点击某个字 → 返回 home 并打开对应详情（复用 App 的选择逻辑）
    - 页面空态：当某些字无 extensions 时提示“暂无延展提案”

- 新增 `src/pages/ProfilePage.tsx`
  - 功能：
    - 收藏列表（本地持久化）：展示收藏的字卡（紧凑布局），支持取消收藏
    - 最近浏览（本地持久化）：按时间倒序展示最近打开的详情入口
  - 空态：
    - 无收藏：引导去字库添加收藏（按钮返回 home）
    - 无足迹：提示“开始浏览任意汉字即可生成足迹”

- 新增 `src/pages/ImmersivePage.tsx`
  - 用于承接“3D 数字文物 / AR 互动”入口
  - 内容为“可上线”的说明页：包含体验目标、加载前置条件（网络/性能）、未来接入方式（例如：模型懒加载、降级策略）
  - 提供“返回详情/返回字库”的明确 CTA

### 3) 补齐移动端底部导航（从 toast → 导航）

- 修改 [src/components/MobileTabBar.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/MobileTabBar.tsx#L1-L74)
  - API 调整：从仅 `onOpenAIChat` 扩展为 `activePage` + `onNavigate` + `onOpenAIChat`
  - Tab 点击行为：
    - 字库 → `navigate('home')`
    - 文创 → `navigate('shop')`
    - 我的 → `navigate('profile')`
  - 视觉：为选中项提供一致的选中态（颜色/底纹），避免仅靠文字颜色

### 4) 详情页关键动作落地（分享/读音/沉浸入口）

- 修改 [src/components/CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L43-L398)
  - 分享：
    - 生成分享 URL：基于当前 pathname + `?char=...`（必要时保留 page=home）
    - `navigator.share` 可用 → share；失败/不可用 → `navigator.clipboard.writeText(url)` 并 toast
  - 播放读音：
    - 使用 `speechSynthesis` 合成中文读音（文本：`character.char + character.pinyin`）
    - 增加“停止播放”的状态反馈（按钮 aria-label 变更）
  - 3D/AR 入口：
    - 点击跳转到 `page=immersive`，并携带 `char` 以便在沉浸页显示“与该字关联的展品/母题”（纯文案即可）

### 5) 收藏与足迹（本地持久化）

- 新增 `src/lib/user-collection.ts`
  - `getFavorites()/toggleFavorite(id)/isFavorite(id)`
  - `getRecentViews()/pushRecentView(id)`（限制长度，例如 20）
  - 存储 key 统一命名，版本号前缀（例如 `jingchu:favorites:v1`）

- 修改 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx#L43-L398)
  - 在右上角操作区新增“收藏/取消收藏”按钮（lucide icon），并在收藏变更时 toast
  - 打开详情时 `pushRecentView(character.id)`

### 6) 统一 toast（减少重复实现）

- 新增 `src/components/ToastHost.tsx`（或 `Toast.tsx`）
  - App 维护 `toast` 状态并渲染 ToastHost
  - 向需要提示的组件传 `pushToast(message)`

## 边界与失败模式

- Web Share / Clipboard 权限失败：fallback 为“选中文案 + 提示用户手动复制”，toast 文案需明确。
- SpeechSynthesis 不可用：按钮置灰并给出“当前浏览器不支持语音朗读”的提示（不使用内部口吻）。
- localStorage 不可用（隐私模式/禁用）：收藏/足迹退化为仅内存态，并提示“当前环境无法保存到本地”。

## 验证步骤（不包含启动命令）

- URL 兼容：
  - 访问无 `page` 的旧链接：`?q=...&cat=...&char=...` 能正确还原到 home 并打开详情
  - 切换页面后刷新：仍停留在对应 page
- 移动端 Tab：
  - 四个入口均可达；选中态正确；切换不会导致页面横向溢出
- 详情动作：
  - 分享在支持/不支持 Web Share 的浏览器均有可用结果
  - 读音按钮可播放、可停止（或明确降级）
  - 3D/AR 入口进入沉浸页，且可返回
- 收藏与足迹：
  - 收藏后在“我的”页可见；取消收藏实时更新
  - 最近浏览随打开详情更新，长度限制生效

## 交付物清单

- 新增页面：ShopPage / ProfilePage / ImmersivePage
- 移动端底部导航：从 toast 占位升级为真实导航
- 详情页动作：分享 / 读音 / 收藏 / 沉浸入口
- 本地数据层：收藏与足迹
- 统一提示：ToastHost

