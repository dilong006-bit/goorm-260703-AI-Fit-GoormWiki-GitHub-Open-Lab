import { config } from '../config'
import { createOpenAICompatibleAdapter } from '../providers/openaiCompatible'
import { claudeAdapter } from '../providers/claude'
import { geminiAdapter } from '../providers/gemini'
import { mockAdapter } from '../providers/mock'
import type { LLMProvider, ProviderName } from '../types'

/** Provider → 어댑터 매핑. OpenAI/Perplexity는 동일 호환 어댑터를 baseURL만 달리해 공유. */
export const registry: Record<ProviderName, LLMProvider> = {
  mock: mockAdapter,
  openai: createOpenAICompatibleAdapter({
    provider: 'openai',
    apiKey: config.openai.apiKey,
    baseURL: config.openai.baseURL,
  }),
  claude: claudeAdapter,
  gemini: geminiAdapter,
  perplexity: createOpenAICompatibleAdapter({
    provider: 'perplexity',
    apiKey: config.perplexity.apiKey,
    baseURL: config.perplexity.baseURL,
  }),
}
