import { LLMError, type GenerateResponse, type LLMProvider } from '../types'
import { config } from '../config'
import { sseData } from './sse'

const PROVIDER = 'claude' as const

/** Anthropic Messages API 어댑터 (브라우저 직접 호출 헤더 포함). */
export const claudeAdapter: LLMProvider = {
  async generate(req) {
    const start = Date.now()
    const res = await post(req, false)
    const json = await res.json()
    const text: string =
      json.content?.map((b: { text?: string }) => b.text ?? '').join('') ?? ''
    return {
      text,
      usage: json.usage
        ? {
            inputTokens: json.usage.input_tokens ?? 0,
            outputTokens: json.usage.output_tokens ?? 0,
            totalTokens:
              (json.usage.input_tokens ?? 0) + (json.usage.output_tokens ?? 0),
          }
        : undefined,
      finishReason: json.stop_reason,
      provider: PROVIDER,
      model: req.model,
      latency: Date.now() - start,
      raw: json,
    } satisfies GenerateResponse
  },

  async *stream(req) {
    const res = await post(req, true)
    for await (const data of sseData(res)) {
      try {
        const json = JSON.parse(data)
        if (
          json.type === 'content_block_delta' &&
          json.delta?.type === 'text_delta'
        ) {
          yield json.delta.text as string
        }
      } catch {
        // event: 라인 등 무시
      }
    }
  },
}

async function post(
  req: { model: string; systemPrompt?: string; prompt: string; maxTokens?: number; temperature?: number; signal?: AbortSignal },
  stream: boolean,
): Promise<Response> {
  const { apiKey, baseURL } = config.claude
  if (!apiKey) {
    throw new LLMError('API key not configured for claude.', PROVIDER)
  }
  const res = await fetch(`${baseURL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // 브라우저에서 직접 호출 허용 (개발/시연용)
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: req.model,
      system: req.systemPrompt,
      messages: [{ role: 'user', content: req.prompt }],
      max_tokens: req.maxTokens ?? 1024,
      temperature: req.temperature ?? 0.7,
      stream,
    }),
    signal: req.signal,
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new LLMError(
      `claude request failed (${res.status}). ${detail.slice(0, 200)}`,
      PROVIDER,
      res.status,
    )
  }
  return res
}
