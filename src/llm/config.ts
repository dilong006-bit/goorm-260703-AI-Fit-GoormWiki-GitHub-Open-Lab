import type { ProviderName } from './types'

/**
 * Provider별 API 키 (개발용 VITE_ 환경변수).
 * 운영에서는 서버리스 프록시 사용을 권장(SPEC Phase 3 §7). 키가 없으면 mock으로 폴백된다.
 */
export const config = {
  openai: {
    apiKey: (import.meta.env.VITE_OPENAI_KEY as string) || '',
    baseURL: 'https://api.openai.com/v1',
  },
  claude: {
    apiKey: (import.meta.env.VITE_CLAUDE_KEY as string) || '',
    baseURL: 'https://api.anthropic.com/v1',
  },
  gemini: {
    apiKey: (import.meta.env.VITE_GEMINI_KEY as string) || '',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  },
  perplexity: {
    apiKey: (import.meta.env.VITE_PERPLEXITY_KEY as string) || '',
    baseURL: 'https://api.perplexity.ai',
  },
} as const

/** Provider별 선택 가능한 모델 (표시명 → 실제 모델 ID). */
export const models = {
  mock: {
    'mock-fast': 'mock-fast',
  },
  openai: {
    'gpt-5': 'gpt-5',
    'gpt-5-mini': 'gpt-5-mini',
    'gpt-5-nano': 'gpt-5-nano',
  },
  claude: {
    'claude-opus': 'claude-opus-4-8',
    'claude-sonnet': 'claude-sonnet-4-6',
  },
  gemini: {
    'gemini-2.5-pro': 'gemini-2.5-pro',
    'gemini-2.5-flash': 'gemini-2.5-flash',
  },
  perplexity: {
    sonar: 'sonar',
    'sonar-pro': 'sonar-pro',
  },
} as const

/** 해당 provider의 키가 설정되어 있는지. (mock은 항상 사용 가능) */
export function hasApiKey(provider: ProviderName): boolean {
  if (provider === 'mock') return true
  return Boolean(config[provider]?.apiKey)
}

/** 키가 설정된 provider 목록 (mock 항상 포함). */
export function availableProviders(): ProviderName[] {
  const all: ProviderName[] = ['openai', 'claude', 'gemini', 'perplexity']
  return ['mock', ...all.filter((p) => hasApiKey(p))]
}

/** 실제 키가 하나라도 있으면 그 첫 provider, 없으면 mock. */
export function defaultProvider(): ProviderName {
  const real = availableProviders().filter((p) => p !== 'mock')
  return real[0] ?? 'mock'
}
