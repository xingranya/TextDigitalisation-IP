export async function* iterateSSEDataLines(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })

    while (true) {
      const lineBreakIndex = buffer.indexOf('\n')
      if (lineBreakIndex === -1) {
        break
      }

      const line = buffer.slice(0, lineBreakIndex).trimEnd()
      buffer = buffer.slice(lineBreakIndex + 1)

      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) {
        continue
      }

      const data = trimmed.slice('data:'.length).trim()
      if (!data) {
        continue
      }

      if (data === '[DONE]') {
        return
      }

      yield data
    }
  }
}

