export interface AIConfig {
  apiKey: string | null
  baseUrl: string
  model: string
  extraBody?: Record<string, unknown>
}

const readString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const safeJsonParse = (value: string) => {
  try {
    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined
    }
    return parsed as Record<string, unknown>
  } catch {
    return undefined
  }
}

export const readAIConfig = (): AIConfig => {
  const apiKey = readString(import.meta.env.VITE_DASHSCOPE_API_KEY)
  const baseUrl = readString(import.meta.env.VITE_DASHSCOPE_BASE_URL) || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  const model = readString(import.meta.env.VITE_DASHSCOPE_MODEL) || 'qwen-max'
  const extraBodyRaw = readString(import.meta.env.VITE_DASHSCOPE_EXTRA_BODY)
  const extraBody = extraBodyRaw ? safeJsonParse(extraBodyRaw) : undefined

  return {
    apiKey: apiKey ? apiKey : null,
    baseUrl,
    model,
    extraBody,
  }
}

