import type { CharacterRecord } from '../types/character'

const normalizeText = (value: string) => value.trim().toLowerCase()

const getSearchScore = (character: CharacterRecord, query: string) => {
  if (!query) {
    return character.featured ? 10 : 0
  }

  const fields = [
    character.char,
    character.pinyin,
    character.title,
    character.category,
    character.era,
    character.motif,
    character.summary,
    character.description,
    character.quote,
    ...character.searchTokens,
    ...character.extensions.flatMap((item) => [item.title, item.note]),
  ].map(normalizeText)

  let score = 0

  fields.forEach((field, index) => {
    if (field === query) {
      score += index === 0 ? 120 : 80
      return
    }

    if (field.startsWith(query)) {
      score += index <= 2 ? 60 : 34
      return
    }

    if (field.includes(query)) {
      score += index <= 4 ? 26 : 12
    }
  })

  if (character.featured) {
    score += 4
  }

  return score
}

export const filterCharacters = (
  characters: CharacterRecord[],
  query: string,
  category: string,
) => {
  const normalizedQuery = normalizeText(query)

  return characters
    .map((character) => ({
      character,
      score: getSearchScore(character, normalizedQuery),
    }))
    .filter(({ character, score }) => {
      const matchesCategory = category === '全部' || character.category === category

      if (!matchesCategory) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return score > 0
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      if (left.character.featured !== right.character.featured) {
        return Number(right.character.featured) - Number(left.character.featured)
      }

      return left.character.char.localeCompare(right.character.char, 'zh-Hans-CN')
    })
    .map(({ character }) => character)
}
