export interface CharacterExtension {
  title: string
  note: string
}

export interface CharacterRecord {
  id: string
  char: string
  pinyin: string
  title: string
  category: string
  era: string
  motif: string
  summary: string
  description: string
  quote: string
  accent: string
  searchTokens: string[]
  extensions: CharacterExtension[]
  featured?: boolean
}
