import { LLMError, type GenerateRequest, type GenerateResponse, type LLMProvider } from '../types'
import { config } from '../config'
import { sseData } from './sse'

const PROVIDER = 'gemini' as const

/** Google Gemini (generateContent / streamGenerateContent) 어댑터. */
export const geminiAdapter: LLMProvider = {
  async generate(req) {
    const start = Date.now()
    const res = await post(req, false)
    const json = await res.json()
    const text: string =
      json.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? '')
        .join('') ?? ''
    const usage = json.usageMetadata
    return {
      text,
      usage: usage
        ? {
            inputTokens: usage.promptTokenCount ?? 0,
            outputTokens: usage.candidatesTokenCount ?? 0,
            totalTokens: usage.totalTokenCount ?? 0,
          }
        : undefined,
      finishReason: json.candidates?.[0]?.finishReason,
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
        const text: string =
          json.candidates?.[0]?.content?.parts
            ?.map((p: { text?: string }) => p.text ?? '')
            .join('') ?? ''
        if (text) yield text
      } catch {
        // 무시
      }
    }
  },
}

async function post(req: GenerateRequest, stream: boolean): Promise<Response> {
  const { apiKey, baseURL } = config.gemini
  if (!apiKey) {
    throw new LLMError('API key not configured for gemini.', PROVIDER)
  }
  const method = stream ? 'streamGenerateContent' : 'generateContent'
  const query = stream ? `?alt=sse&key=${apiKey}` : `?key=${apiKey}`
  const res = await fetch(`${baseURL}/models/${req.model}:${method}${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
      ...(req.systemPrompt
        ? { systemInstruction: { parts: [{ text: req.systemPrompt }] } }
        : {}),
      generationConfig: {
        temperature: req.temperature ?? 0.7,
        maxOutputTokens: req.maxTokens,
      },
    }),
    signal: req.signal,
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new LLMError(
      `gemini request failed (${res.status}). ${detail.slice(0, 200)}`,
      PROVIDER,
      res.status,
    )
  }
  return res
}
