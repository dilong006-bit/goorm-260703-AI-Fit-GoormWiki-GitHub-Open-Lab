import { LLMError, type GenerateRequest, type GenerateResponse, type LLMProvider, type ProviderName } from '../types'
import { sseData } from './sse'

interface OpenAICompatOptions {
  provider: ProviderName
  apiKey: string
  baseURL: string
}

/**
 * OpenAI Chat Completions 호환 어댑터.
 * OpenAI와 Perplexity(동일 스펙, baseURL만 상이)가 공유한다.
 */
export function createOpenAICompatibleAdapter(
  opts: OpenAICompatOptions,
): LLMProvider {
  const { provider, apiKey, baseURL } = opts

  function buildBody(req: GenerateRequest, stream: boolean) {
    const messages = [
      ...(req.systemPrompt
        ? [{ role: 'system', content: req.systemPrompt }]
        : []),
      { role: 'user', content: req.prompt },
    ]
    return JSON.stringify({
      model: req.model,
      messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.maxTokens,
      stream,
    })
  }

  async function post(req: GenerateRequest, stream: boolean): Promise<Response> {
    if (!apiKey) {
      throw new LLMError(`API key not configured for ${provider}.`, provider)
    }
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: buildBody(req, stream),
      signal: req.signal,
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new LLMError(
        `${provider} request failed (${res.status}). ${detail.slice(0, 200)}`,
        provider,
        res.status,
      )
    }
    return res
  }

  return {
    async generate(req) {
      const start = Date.now()
      const res = await post(req, false)
      const json = await res.json()
      const text: string = json.choices?.[0]?.message?.content ?? ''
      return {
        text,
        usage: json.usage
          ? {
              inputTokens: json.usage.prompt_tokens ?? 0,
              outputTokens: json.usage.completion_tokens ?? 0,
              totalTokens: json.usage.total_tokens ?? 0,
            }
          : undefined,
        finishReason: json.choices?.[0]?.finish_reason,
        provider,
        model: req.model,
        latency: Date.now() - start,
        raw: json,
      } satisfies GenerateResponse
    },

    async *stream(req) {
      const res = await post(req, true)
      for await (const data of sseData(res)) {
        if (data === '[DONE]') return
        try {
          const json = JSON.parse(data)
          const delta: string = json.choices?.[0]?.delta?.content ?? ''
          if (delta) yield delta
        } catch {
          // 파싱 불가한 keep-alive 등은 무시
        }
      }
    },
  }
}
