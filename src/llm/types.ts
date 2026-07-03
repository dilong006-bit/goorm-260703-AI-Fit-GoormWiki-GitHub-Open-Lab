/**
 * Multi-LLM 게이트웨이 타입.
 * 참고: junsang-dong/goorm-260630-multi-llm-sdk 의 인터페이스를 이식하고,
 * 키 없이도 동작하도록 'mock' 프로바이더를 추가했다.
 */
export type ProviderName =
  | 'mock'
  | 'openai'
  | 'claude'
  | 'gemini'
  | 'perplexity'

export interface GenerateRequest {
  provider: ProviderName
  model: string
  systemPrompt?: string
  prompt: string
  temperature?: number
  maxTokens?: number
  /** 스트리밍 취소용 */
  signal?: AbortSignal
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export interface GenerateResponse {
  text: string
  usage?: TokenUsage
  finishReason?: string
  provider: ProviderName
  model: string
  /** ms */
  latency: number
  raw?: unknown
}

export interface LLMProvider {
  generate(request: GenerateRequest): Promise<GenerateResponse>
  stream(request: GenerateRequest): AsyncGenerator<string, void, unknown>
}

/** 사용자 친화적 LLM 오류. */
export class LLMError extends Error {
  provider: ProviderName
  status?: number

  constructor(message: string, provider: ProviderName, status?: number) {
    super(message)
    this.name = 'LLMError'
    this.provider = provider
    this.status = status
  }
}
