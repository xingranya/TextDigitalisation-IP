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
  fontFamily?: string
  rotation?: number
  scale?: number
  fontWeight?: number | string
  italic?: boolean
  searchTokens: string[]
  extensions: CharacterExtension[]
  featured?: boolean
  images?: string[]
}
