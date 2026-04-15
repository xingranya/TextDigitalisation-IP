import { iterateSSEDataLines } from '../lib/sse'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionParams {
  baseUrl: string
  model: string
  apiKey: string
  messages: ChatMessage[]
  extraBody?: Record<string, unknown>
  signal?: AbortSignal
}

const joinUrl = (baseUrl: string, path: string) => {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

const readErrorText = async (response: Response) => {
  try {
    const text = await response.text()
    return text.slice(0, 600)
  } catch {
    return ''
  }
}

export async function chatCompletionOnce({
  baseUrl,
  model,
  apiKey,
  messages,
  extraBody,
  signal,
}: ChatCompletionParams) {
  const response = await fetch(joinUrl(baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      ...(extraBody ? extraBody : {}),
    }),
  })

  if (!response.ok) {
    const errorText = await readErrorText(response)
    throw new Error(`${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ''}`)
  }

  const data = (await response.json()) as unknown
  const content =
    typeof data === 'object' && data
      ? (data as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content
      : undefined
  return typeof content === 'string' ? content : ''
}

export async function* streamChatCompletion({
  baseUrl,
  model,
  apiKey,
  messages,
  extraBody,
  signal,
}: ChatCompletionParams) {
  const response = await fetch(joinUrl(baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      ...(extraBody ? extraBody : {}),
    }),
  })

  if (!response.ok) {
    const errorText = await readErrorText(response)
    throw new Error(`${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ''}`)
  }

  const body = response.body
  if (!body) {
    return
  }

  for await (const dataLine of iterateSSEDataLines(body)) {
    let payload: unknown
    try {
      payload = JSON.parse(dataLine)
    } catch {
      continue
    }

    const delta =
      typeof payload === 'object' && payload
        ? (payload as { choices?: Array<{ delta?: { content?: unknown } }> }).choices?.[0]?.delta?.content
        : undefined
    if (typeof delta === 'string' && delta.length > 0) {
      yield delta
    }
  }
}
