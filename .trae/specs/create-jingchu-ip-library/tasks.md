# Tasks

- [x] Task 1: 初始化 Vite React 项目架构并清理默认模板
  - [x] SubTask 1.1: 运行 `npm create vite@latest frontend -- --template react-ts`
  - [x] SubTask 1.2: 删除默认模板中的无关样式和组件
  - [x] SubTask 1.3: 配置路径别名 (`@/*`) 和开发基础设置

- [x] Task 2: 安装并配置 UI/UX 设计库及工具
  - [x] SubTask 2.1: 安装 `tailwindcss`、`postcss`、`autoprefixer` 并初始化
  - [x] SubTask 2.2: 安装 `framer-motion` 用于动画，`lucide-react` 用于图标
  - [x] SubTask 2.3: 在 `tailwind.config.js` 中配置荆楚文化专属的品牌色（朱砂红、墨黑、青铜绿）与版式（衬线体等）

- [x] Task 3: 构建“文字 IP 库”首页和基础组件
  - [x] SubTask 3.1: 编写顶部导航（Logo、主题切换等）和 Hero 区（包含搜索栏）
  - [x] SubTask 3.2: 编写基于 Mock 数据的几十个汉字 IP 网格展示区
  - [x] SubTask 3.3: 为网格卡片添加悬停与进入时的优雅过渡动画

- [x] Task 4: 实现汉字搜索与筛选逻辑
  - [x] SubTask 4.1: 设计 Mock 数据结构（包含：汉字、拼音、释义、图片、延伸 IP 图片列表）
  - [x] SubTask 4.2: 将搜索框的输入值绑定到状态，实时过滤显示的文字卡片

- [x] Task 5: 编写 IP 详情页 / 详情弹窗
  - [x] SubTask 5.1: 使用 `framer-motion` 实现点击卡片后的共享元素平滑过渡（Shared Layout Animation）
  - [x] SubTask 5.2: 在详情中展示大字体的艺术字形象、详细的文化解读及延伸文创图片轮播或画廊

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
