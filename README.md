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

## 后续建议

1. 将真实艺术字素材接入 `characters.ts`，新增 `poster`、`svg`、`galleryImages` 等字段。
2. 为专题栏目增加轻量路由，例如“楚辞”“图腾”“礼乐”“文创”等子页。
3. 把真实扫码入口参数映射到 URL，例如直接打开指定字符或指定分类。
4. 如果后续接后端，可把 `characters.ts` 替换为 CMS 或静态 JSON 数据源，组件层无需大改。
