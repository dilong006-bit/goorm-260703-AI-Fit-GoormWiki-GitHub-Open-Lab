import { models, stream, type GenerateRequest, type ProviderName } from '@/llm'
import { cache } from '@/services/github/cache'
import { systemPrompt, userPrompt, type ContentType } from './prompts'
import { CONTENT_PROFILES } from './providerProfiles'
import type { Locale } from '@/i18n/types'
import type { Repository } from '@/types/repository'

export interface GenerateContentParams {
  repo: Repository
  readme: string
  type: ContentType
  provider: ProviderName
  /** 모델 표시명 (models config 키) */
  model: string
  locale: Locale
  question?: string
  signal?: AbortSignal
}

/** 표시명 → 실제 모델 ID. */
function resolveModelId(provider: ProviderName, displayName: string): string {
  const table = models[provider] as Record<string, string> | undefined
  return table?.[displayName] ?? displayName
}

function buildRequest(p: GenerateContentParams): GenerateRequest {
  const profile = CONTENT_PROFILES[p.type]
  return {
    provider: p.provider,
    model: resolveModelId(p.provider, p.model),
    systemPrompt: systemPrompt(p.type, p.locale),
    prompt: userPrompt({
      repoName: p.repo.name,
      language: p.repo.language,
      topics: p.repo.topics,
      readme: p.readme,
      question: p.question,
    }),
    maxTokens: profile.maxTokens,
    signal: p.signal,
  }
}

function cacheKey(p: GenerateContentParams): string {
  return `ai:${p.repo.fullName}:${p.type}:${p.provider}:${p.model}:${p.locale}`
}

/**
 * 콘텐츠를 스트리밍 생성한다.
 * 캐시 가능한 유형은 캐시 우선(hit 시 즉시 1회 방출), miss 시 스트림 후 저장한다.
 */
export async function* streamContent(
  p: GenerateContentParams,
): AsyncGenerator<string, void, unknown> {
  const profile = CONTENT_PROFILES[p.type]
  const canCache = profile.cacheable && p.type !== 'qna'

  if (canCache) {
    const cached = cache.get<string>(cacheKey(p))
    if (cached) {
      yield cached
      return
    }
  }

  const req = buildRequest(p)
  let full = ''
  for await (const chunk of stream(req)) {
    full += chunk
    yield chunk
  }

  if (canCache && full.trim()) {
    cache.set(cacheKey(p), full)
  }
}
