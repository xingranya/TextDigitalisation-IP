import type { CharacterRecord } from '../types/character'
import type { ChatMessage } from './ai-client'

export const promptVersion = '2026-04-15-v1'

const compactCharacter = (character: CharacterRecord) => ({
  id: character.id,
  char: character.char,
  title: character.title,
  category: character.category,
  era: character.era,
  motif: character.motif,
  summary: character.summary,
})

export const buildCharacterGuideMessages = (character: CharacterRecord): ChatMessage[] => [
  {
    role: 'system',
    content:
      '你是一位面向游客的荆楚文化导览讲解员，也是文字设计策展人。输出必须是简体中文，语气自然、有画面感，但避免玄学与夸张营销。不得编造具体史实年份或具体机构信息；如果不确定，用模糊表述。',
  },
  {
    role: 'user',
    content: `请基于下面这个“荆楚文字 IP”条目，生成结构化导读。严格按以下格式输出（标题不可改名，顺序不可变）：\n\n【短解读】\n（1-2 句，给游客快速抓重点）\n\n【长解读】\n（3-6 句，解释字形与母题的关系，偏展签风格）\n\n【导览讲解词】\n（适合 60-120 秒口播，含一句引导游客互动的话）\n\n【动线与文创】\n- （3-6 条，条列输出，建议参观动线/拍照点/可做的文创衍生）\n\n条目数据：\n${JSON.stringify(compactCharacter(character), null, 2)}`,
  },
]

export const buildQAMessages = (question: string, characters: CharacterRecord[]): ChatMessage[] => {
  const candidates = characters.slice(0, 40).map(compactCharacter)

  return [
    {
      role: 'system',
      content:
        '你是“荆楚字韵”平台里的 AI 导览助手。输出必须是简体中文，避免夸张营销；不要输出 Markdown 代码块。只能从候选字库里挑字，不要捏造不存在的字。',
    },
    {
      role: 'user',
      content: `用户问题：${question}\n\n可选字库（JSON，按 id/char/title/category/era/motif/summary 提供）：\n${JSON.stringify(candidates, null, 2)}\n\n请严格按以下格式输出（标题不可改名，顺序不可变）：\n【推荐】字1|字2|字3（最多 3 个，只输出单个汉字，用竖线分隔）\n【理由】用 3-6 句解释为什么推荐这些字，并点到它们的母题/时代/气质差异\n【下一步】用 1-3 句引导用户点击哪个字开始看，以及还能怎么继续探索`,
    },
    {
      role: 'user',
      content:
        '额外规则：\n1) 如果用户只是打招呼/寒暄（例如“你好”“在吗”“谢谢”），不要强行硬匹配；先友好回应一句，并推荐平台最适合入门的 3 个字（优先在候选中选择“荆/楚/钟”，没有再选最靠前的 3 个）。\n2) 推荐必须是候选字库里的 char。\n3) 输出里不要出现多余的标题或分隔线。',
    },
  ]
}
