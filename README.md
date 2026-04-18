# 荆楚字韵前端说明

这是一个纯前端的荆楚文化数字化文字 IP 展示站，面向线下扫码游客和线上文化兴趣用户。项目当前重点不是做“字典”，而是做一座可快速浏览、可继续扩展的数字字库展馆。

## 当前架构

`src/data/characters.ts`
负责维护字库内容模型。每个字除了基础字形，还包含时代、母题、搜索关键词、文化介绍和延展 IP 场景，后续可以继续挂接真实艺术字素材、SVG、专题文章和文创图片。

`src/components/SearchHero.tsx`
首页英雄区与搜索入口，负责承接扫码场景下的首屏浏览体验。

`src/components/CategoryRail.tsx`
分类筛选轨道，支持按母题浏览不同字符集合。

`src/components/CharacterCard.tsx`
字卡网格项，负责首页策展化展示。

`src/components/CharacterDetailModal.tsx`
详情弹层，集中展示单字的文化背景与延展应用。

`src/lib/filter-characters.ts`
搜索和排序逻辑，支持汉字、拼音、母题、关键词和延展场景检索。

`src/lib/url-state.ts`
负责把搜索词、分类和当前打开的字符同步到 URL，方便二维码深链和分享。

## UI / UX 设计栈

- `React 19 + TypeScript`
- `Vite`
- `Tailwind CSS`
- `Framer Motion`
- `Lucide React`

当前视觉方向遵循 `.impeccable.md` 中的设计上下文：

- 以“数字展馆 / 当代策展”而不是后台管理页为目标气质
- 以纸感底色、楚漆红、青铜色为主视觉基调
- 以中文衬线标题配无衬线正文，突出字形本身的展陈感
- 以轻量而明确的动效连接搜索、浏览和详情展开

## 如何新增一个字（给“其他 AI / 新同事”用）

下面是一套“照着做就不会出错”的添加流程。本项目字库是**纯前端固化数据**：图片放 `public`，文案写进 `src/data/characters.ts`。

### 0) 你需要准备什么

- 一个汉字（单个字符）：例如 `雷`
- 一张主视觉艺术字图：命名为 `雷.jpg`
- 一段短摘要（1 句，给卡片/列表）
- 一段长解读（2–6 段，给详情页，可包含“短解读/长解读”）
- 可选：拼音、分类、时代、母题关键词、延展场景

### 1) 放图片到正确位置

1. 把图片放到：`public/ip/`
2. 文件名必须等于汉字本身：`public/ip/雷.jpg`
3. 在代码里引用图片路径统一用：`/ip/雷.jpg`

说明：
- 本项目不再使用根目录的 `ip/` 文件夹；请只使用 `public/ip/`。
- 如果图片太大（>300KB），建议压缩后再放入（移动端体验更好）。

### 2) 在字库数据里新增一条记录

编辑：`src/data/characters.ts`

找到顶部的 `const ipCharacters: CharacterRecord[] = [`，把新字对象插入进去（建议插在末尾或你希望的排序位置）。

一个最小可用模板如下（复制后替换内容即可）：

```ts
{
  id: 'ip-lei',
  char: '雷',
  pinyin: 'léi',
  title: '云雷鎏金',
  category: '楚简姓氏 IP',
  era: '战国·楚简',
  motif: '小篆结构、云雷纹、藏青鎏金、漆器错彩',
  summary: '一句话短摘要（用于卡片）',
  description:
    '长解读第一段。\n\n短解读：……\n长解读：……',
  quote: '一句短引文（可选）',
  accent: 'oklch(0.58 0.1 240)',
  priority: 170,
  fontFamily: '"ZCOOL QingKe HuangYou", display',
  rotation: 0,
  scale: 1,
  fontWeight: 'normal',
  italic: false,
  searchTokens: ['雷', '楚简', '云雷纹', '小篆'],
  extensions: [
    { title: '应用方向', note: '一句话说明这个字适合怎么用' },
  ],
  featured: true,
  images: ['/ip/雷.jpg'],
},
```

字段说明（按重要性）：
- `id`：全局唯一；IP 字建议用 `ip-xxx`（拼音或英文缩写），不要和已有 id 重复。
- `char`：必须是单个汉字。
- `summary`：短摘要（强烈建议 1 句）。
- `description`：长解读；支持 `\n\n` 分段；建议包含“短解读/长解读”。
- `images`：必须是 `['/ip/汉字.jpg']`，否则卡片/详情不会优先展示你的图片。
- `priority`：越大越靠前（首页无搜索时 + 搜索同分时都会优先）。IP 字通常用 200 往下排。
- `searchTokens`：把你希望用户能搜到的关键词都丢进去（非遗名、器物名、地名、纹样名等）。

### 3) 排序规则（你为什么会“找不到/不在前面”）

- 首页无搜索时：先按 `priority` 排，再按 `featured` 排（详情见 `src/App.tsx`）。
- 有搜索词时：先按 `filter-characters.ts` 的打分排；同分再按 `priority`。

建议：新加 IP 字给一个明显的 `priority`（例如 180），就能稳定在前排。

### 4) 跑一次校验（必做）

在项目根目录执行：

```bash
npm run lint
npm run build
```

两个都通过，说明类型、引用、构建产物都没问题。

### 5) 常见错误排查

- 图片不显示：
  - 检查是否放在 `public/ip/` 而不是别处
  - 检查文件名是否与汉字完全一致（含大小写、无空格）
  - 检查 `images` 是否写成 `['/ip/汉字.jpg']`
- 搜不到：
  - 补充 `searchTokens`（把非遗/器物/地名/别称加进去）
  - 确认 `summary/description/motif` 里也出现关键字（搜索会综合打分）
- 不在前面：
  - 提高 `priority`（数字越大越靠前）

## 后续建议

1. 将真实艺术字素材接入 `characters.ts`，新增 `poster`、`svg`、`galleryImages` 等字段。
2. 为专题栏目增加轻量路由，例如“楚辞”“图腾”“礼乐”“文创”等子页。
3. 把真实扫码入口参数映射到 URL，例如直接打开指定字符或指定分类。
4. 如果后续接后端，可把 `characters.ts` 替换为 CMS 或静态 JSON 数据源，组件层无需大改。
