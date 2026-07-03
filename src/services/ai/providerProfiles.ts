import type { ContentType } from './prompts'
import type { ProviderName } from '@/llm'

interface Profile {
  /** 추천 provider (키가 없으면 mock/사용가능 provider로 대체됨) */
  recommended: ProviderName
  /** 추천 모델 표시명 (models config의 키) */
  model: string
  /** 응답 토큰 상한 */
  maxTokens: number
  /** 결과를 캐시할지 (qna는 대화형이라 미캐시) */
  cacheable: boolean
}

/** 콘텐츠 유형별 추천 provider/model 및 정책. (SPEC Phase 3 §4) */
export const CONTENT_PROFILES: Record<ContentType, Profile> = {
  brief: { recommended: 'gemini', model: 'gemini-2.5-flash', maxTokens: 512, cacheable: true },
  roadmap: { recommended: 'claude', model: 'claude-sonnet', maxTokens: 1024, cacheable: true },
  quiz: { recommended: 'openai', model: 'gpt-5-mini', maxTokens: 1024, cacheable: true },
  translate: { recommended: 'gemini', model: 'gemini-2.5-flash', maxTokens: 4096, cacheable: true },
  qna: { recommended: 'claude', model: 'claude-opus', maxTokens: 2048, cacheable: false },
  trend: { recommended: 'perplexity', model: 'sonar', maxTokens: 1024, cacheable: true },
}
