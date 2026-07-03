import { registry } from './registry'
import type {
  GenerateRequest,
  GenerateResponse,
  LLMProvider,
  ProviderName,
} from '../types'

/** provider 이름으로 어댑터를 얻는다. */
export function createLLM(options: { provider: ProviderName }): LLMProvider {
  const adapter = registry[options.provider]
  if (!adapter) throw new Error(`Unknown provider: ${options.provider}`)
  return adapter
}

/** 단발 생성. */
export function generate(req: GenerateRequest): Promise<GenerateResponse> {
  return registry[req.provider].generate(req)
}

/** 스트리밍 생성. */
export function stream(
  req: GenerateRequest,
): AsyncGenerator<string, void, unknown> {
  return registry[req.provider].stream(req)
}
