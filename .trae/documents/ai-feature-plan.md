# AI 功能接入计划（导读 + 问答，阿里云百炼）

## 1. 摘要
在保持“纯前端项目、无后端”的前提下，为网站增加两类 AI 能力，并对接 **阿里云百炼（DashScope）**：
- **AI 导读/解读**：在汉字详情弹窗中一键生成“短解读 / 长解读 / 导览讲解词 / 推荐动线与文创延展”。
- **AI 问答**：在首页提供“问 AI”，支持流式输出，并可一键把 AI 推荐的汉字打开详情弹窗继续浏览。

考虑到你选择“纯前端直连 + 流式输出”，本方案采用 **百炼的 OpenAI 兼容接口（compatible-mode）**。密钥按你的要求使用 **.env 环境变量** 提供（本地开发/构建时注入），不写入代码仓库。

重要说明：Vite 的 `VITE_` 环境变量会进入前端构建产物，因此“用 .env 不提交到仓库”只能避免源码泄露，**无法避免在浏览器端被查看**。如果后续需要真正保密，必须改成后端/云函数中转（本计划先按你的要求实现）。

## 2. 现状分析（基于代码检索与构建校验）
- 架构：无路由单页应用，入口 [main.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/main.tsx)，顶层状态在 [App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx)。
- 数据：字库数据为本地静态数组 [characters.ts](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/data/characters.ts)。
- 交互：详情弹窗 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx) 已具备 modal 语义与基础 focus trap，适合承载 AI 导读。
- 网络层：当前项目无 `fetch/axios` 请求封装，也无流式解析工具。
- 依赖：仅 React + Framer Motion + Tailwind + lucide-react，无 AI SDK。

## 3. 目标与验收标准
### 3.1 AI 导读（详情弹窗内）
- 用户打开任意汉字详情后可看到“AI 导读”区块。
- 点击“生成导读”后**流式**显示输出（逐步出现文字），并具备：
  - 加载态（生成中）
  - 中止按钮（停止生成）
  - 错误态（网络/鉴权/限流）
  - 复制结果（复制到剪贴板）
- 输出内容至少包含四段，且每段有明确标题（不依赖 Markdown 解析，直接用段落/小标题渲染）：
  - 短解读（1–2 句）
  - 长解读（3–6 句）
  - 导览讲解词（面向游客，60–120 秒可读）
  - 推荐动线与文创延展（条列 3–6 条）

### 3.2 AI 问答（首页/快捷入口）
- 首页提供“问 AI”入口（按钮或 chip），打开一个底部抽屉/弹层。
- 输入自然语言问题（如“我想看一个和端午有关的字”），AI **流式**回答：
  - 先给推荐字（最多 3 个）
  - 再给理由
  - 最后给下一步建议（例如点开某个字）
- AI 回答中的推荐字提供按钮，点击直接打开对应详情弹窗（复用现有 `selectedId` 流程）。

### 3.3 配置（.env 环境变量）
- 新增 `.env.example`，并要求开发者在本地创建 `.env.local`（或 `.env.development.local`）填入 Key。
- 读取以下 Vite 环境变量（均以 `VITE_` 开头，才能在前端访问）：
  - `VITE_DASHSCOPE_API_KEY`：百炼 API Key
  - `VITE_DASHSCOPE_BASE_URL`：默认 `https://dashscope.aliyuncs.com/compatible-mode/v1`
  - `VITE_DASHSCOPE_MODEL`：默认 `qwen-max`（你也可改成百炼支持的其他模型，例如 deepseek 系列等）
  - `VITE_DASHSCOPE_EXTRA_BODY`（可选）：JSON 字符串，透传到请求体（用于 `enable_thinking` 这类非标准参数）
- 若未配置 Key：AI 入口显示“AI 未配置，请在 .env.local 中设置”，并提供可复制的变量名提示。

## 4. 方案设计（关键决策）
### 4.1 接口协议（百炼 OpenAI 兼容）
- 采用 **DashScope OpenAI 兼容 Chat Completions**（参考“首次调用千问 API / OpenAI 兼容接口”相关文档）：
  - 非流式：`POST {baseUrl}/chat/completions`，`stream=false`
  - 流式：`stream=true`，解析 SSE：`data: { choices: [{ delta: { content } }] }`
  - Header：`Authorization: Bearer {VITE_DASHSCOPE_API_KEY}`，`Content-Type: application/json`
- 不引入第三方 SDK，使用 `fetch` + `ReadableStream`，减少依赖与体积，便于部署。

### 4.2 缓存策略（轻量、纯前端）
- 以 `character.id + promptVersion` 作为 key，缓存 AI 导读结果到 `sessionStorage`（刷新失效，避免长期堆积）。
- AI 问答默认不缓存（避免用户隐私长期留存）；可选提供“保存本次问答”按钮，保存到 sessionStorage。

### 4.3 安全策略（纯前端约束下的底线）
- 不在仓库中提交 `.env*`（提交 `.env.example` 仅示例，无密钥）。
- 不在 console 输出任何 Key / 完整请求体。
- 在 UI 文案中明确提示：这是“前端直连模式”，Key 可能被浏览器端查看；建议使用百炼侧的配额/限流能力控制风险。

## 5. 具体改动（文件级）
### 5.1 新增：AI 配置（环境变量）
- 新建 `src/lib/ai-config.ts`
  - `readAIConfig()`：从 `import.meta.env` 读取并做兜底默认值（baseUrl/model）
  - `getExtraBody()`：解析 `VITE_DASHSCOPE_EXTRA_BODY`（无则返回 undefined）
- 新增 `.env.example`（根目录）
  - 包含上述变量名与示例值（不包含真实 Key）
- 修改 `.gitignore`
  - 增加 `.env`、`.env.*` 忽略规则（保留 `.env.example`）

### 5.2 新增：流式请求与解析
- 新建 `src/services/ai-client.ts`
  - `streamChatCompletion({ baseUrl, model, apiKey, messages, extraBody, signal })`：持续产出文本增量
  - `chatCompletionOnce(...)`：一次性返回完整文本（用于降级/不支持流式时）
- 新建 `src/lib/sse.ts`
  - 解析 `data:` 行，处理 `[DONE]`，兼容跨 chunk 的半行情况

### 5.3 新增：Prompt 模板
- 新建 `src/services/ai-prompts.ts`
  - `buildCharacterGuidePrompt(character)`：导读 prompt（明确输出结构：四段标题 + 内容）
  - `buildQAPrompt({ question, characters })`：问答 prompt（要求输出可识别的“推荐字列表”）
  - 统一一个 `promptVersion` 常量，用于缓存失效

### 5.4 新增：UI 组件
- 不再新增“设置面板”表单（改为 .env 驱动）。如需提示配置，在 UI 中展示一段“如何配置 .env.local”的引导卡片即可。
- 新建 `src/components/AIChatSheet.tsx`
  - 底部抽屉（移动优先），包含输入框、发送按钮、输出区、停止按钮
  - 输出区支持流式追加文本与自动滚动
  - 从回答中识别推荐字（按 prompt 要求输出 JSON 或特定格式），渲染为可点击 chip
- 新建 `src/components/CharacterAIGuide.tsx`
  - 仅用于详情页：按钮（生成/停止/复制），输出四段结构化内容
  - 内部使用 `streamChatCompletion`

### 5.5 修改：详情弹窗接入 AI 导读
- 修改 [CharacterDetailModal.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/CharacterDetailModal.tsx)
  - 在“字形详情/短摘要”附近插入 `CharacterAIGuide`
  - AI 输出采用现有 `paper-panel` 风格，保持统一

### 5.6 修改：首页接入 AI 问答入口
- 修改 [SearchHero.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/SearchHero.tsx)
  - 在关键词 chips 附近增加“问 AI”按钮（触发 `onOpenAIChat()`）

### 5.7 修改：底部导航接入 AI 设置/问答
- 修改 [MobileTabBar.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/components/MobileTabBar.tsx)
  - 将“路线”替换为打开 `AIChatSheet`（问答入口）
  - “我的”保持原样或继续 toast（本计划不做表单设置页）

### 5.8 修改：App 顶层状态编排
- 修改 [App.tsx](file:///Users/xingranya/Downloads/HTML+CSS/TextDigitalisation-IP/src/App.tsx)
  - 新增：
    - `isAIChatOpen`
    - 打开/关闭回调
  - 渲染：
    - `AIChatSheet`（在 main 之外，以 portal-like 方式覆盖页面）
  - 与现有 modal 的 body 滚动锁协同：任一弹层打开时 `overflow: hidden`
  - AIChatSheet 内点击推荐字：调用 `setSelectedId(id)` 打开详情弹窗

## 6. 边界情况与降级
- 未配置 Key：AI 区块显示“AI 未配置，请在 .env.local 中设置 VITE_DASHSCOPE_API_KEY”。
- 401/403：提示“密钥无效或权限不足”。
- 429：提示“请求过多，请稍后再试”。
- 不支持流式（接口返回非 SSE）：自动降级为一次性请求。
- 离线：复用现有离线提示，AI 按钮置灰并给出提示。

## 7. 验证步骤
- 静态检查：`npm run lint`
- 构建校验：`npm run build`
- 手动验收：
  - 配置 AI 设置（Base URL/Model/Key）后，打开任一详情页，生成 AI 导读，确认流式输出/停止/复制可用
  - 首页打开 AI 问答，输入问题，确认流式输出与推荐字可点开详情
  - 清空 Key 后，AI 功能应提示“先配置”
  - 移动端检查触控目标与抽屉可用性

## 8. 假设与约束
- 不引入后端/云函数（你明确选择纯前端直连）。
- 不把任何密钥写入仓库；仅允许 `.env.local`（或同类本地环境文件）提供。
- 保持现有 UI 风格与组件组织方式（顶层 App 状态 + props 下发）。
