# 艺术字体与排版升级设计方案 (Typography & Artistic Design Plan)

## 1. 摘要 (Summary)
为了实现“千字千面”的视觉冲击力并深度契合荆楚文化气质，本方案将引入多款 Google Fonts 中文书法与艺术字体。通过结合不同的字体族、旋转角度、缩放比例与字重，全面改造现有的统一排版，确保网站内所有汉字不仅美观，且“每一个都不一样”。

## 2. 当前状态分析 (Current State Analysis)
- **数据结构**：`src/types/character.ts` 中仅定义了 `fontFamily` 和 `rotation` 字段。
- **数据源**：`src/data/characters.ts` 仅有前 6 个汉字配置了字体属性，剩余 16 个汉字依然空白。
- **渲染组件**：`CharacterCard.tsx` 和 `CharacterDetailModal.tsx` 中并未实际应用这些字体字段。
- **资源引入**：`index.html` 中尚未引入对应的 Google Web Fonts。

## 3. 提议的修改 (Proposed Changes)

### 3.1 引入 Web Fonts (`index.html`)
- 在 `<head>` 中引入 6 种极具古风与设计感的 Google 中文艺术字体：
  - `Zhi Mang Xing`（行书，狂放）
  - `Long Cang`（草书，飘逸）
  - `Ma Shan Zheng`（毛笔，厚重）
  - `Liu Jian Mao Cao`（草书，草莽）
  - `ZCOOL XiaoWei`（现代衬线，典雅）
  - `ZCOOL QingKe HuangYou`（修长字体，形似小篆/简牍）

### 3.2 扩展数据结构 (`src/types/character.ts`)
- 在 `CharacterRecord` 接口中新增用于微调形变的字段，以增加独特性：
  - `scale?: number`（缩放比例，如 0.85 ~ 1.15）
  - `fontWeight?: number | string`（字重）
  - `italic?: boolean`（是否斜体）

### 3.3 全面配置字符数据 (`src/data/characters.ts`)
- 为全部 22 个荆楚汉字逐一分配上述 6 种字体之一。
- 为每个汉字设置随机且合理的 `rotation`（-8度到8度之间）和 `scale`。
- 通过“字体 + 旋转 + 缩放”的组合公式，确保即使使用相同字体的两个汉字，在视觉上也呈现出截然不同的形态。

### 3.4 改造组件渲染 (`src/components/CharacterCard.tsx` & `src/components/CharacterDetailModal.tsx`)
- 在现有的汉字展示元素内部增加一层 `div` 来承载自定义样式。
- **Why**: 将 `fontFamily`、`transform: rotate(...) scale(...)` 和 `fontWeight` 绑定在内层元素上，外层元素保留 `transition-transform group-hover:scale-105`。这样可避免内联 `transform` 覆盖并破坏 Tailwind 的 Hover 缩放动画。

## 4. 假设与决策 (Assumptions & Decisions)
- **字体选型**：由于中文字体体积较大，仅使用 Google Fonts 提供的免费商用在线字体，利用 `display=swap` 策略防止阻塞渲染（FOIT），保证用户体验。
- **动画兼容性**：采用 DOM 层级嵌套策略（外层动画 + 内层静态形变）是解决 CSS Transform 冲突的最稳健方式。

## 5. 验证步骤 (Verification Steps)
1. 启动 `npm run dev` 并在浏览器中打开。
2. 确认首页网格视图中，所有卡片内的汉字是否加载了特定的书法/艺术字体。
3. 检查每个汉字是否呈现出不同的旋转角度与大小错落感。
4. 悬停（Hover）在卡片上，确保原本的放大动画未受影响。
5. 点击打开详情弹窗，检查大尺寸汉字是否同步展示了对应的艺术字体效果。