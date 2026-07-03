/** fetch 응답 본문을 SSE `data:` 페이로드 문자열 단위로 순회한다. */
export async function* sseData(
  response: Response,
): AsyncGenerator<string, void, unknown> {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // 이벤트는 빈 줄(\n\n)으로 구분
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const evt of events) {
      for (const line of evt.split('\n')) {
        const trimmed = line.trimStart()
        if (trimmed.startsWith('data:')) {
          yield trimmed.slice(5).trim()
        }
      }
    }
  }
}
