import { useCallback, useEffect, useRef, useState } from 'react'
import { streamContent, type GenerateContentParams } from '@/services/ai/contentService'

type Status = 'idle' | 'streaming' | 'done' | 'error'

export type RunParams = Omit<GenerateContentParams, 'signal'>

/**
 * AI 콘텐츠 스트리밍 훅.
 * run()으로 생성 시작, stop()으로 취소. 결과·상태·지연시간을 노출한다.
 */
export function useAIContent() {
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [latency, setLatency] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  const run = useCallback(
    async (params: RunParams) => {
      stop()
      const controller = new AbortController()
      abortRef.current = controller

      setOutput('')
      setError(null)
      setLatency(null)
      setStatus('streaming')

      const start = Date.now()
      try {
        for await (const chunk of streamContent({
          ...params,
          signal: controller.signal,
        })) {
          if (controller.signal.aborted) break
          setOutput((prev) => prev + chunk)
        }
        if (!controller.signal.aborted) {
          setLatency(Date.now() - start)
          setStatus('done')
        }
      } catch (err) {
        if (controller.signal.aborted || (err as Error)?.name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : String(err))
        setStatus('error')
      } finally {
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [stop],
  )

  const reset = useCallback(() => {
    stop()
    setOutput('')
    setStatus('idle')
    setError(null)
    setLatency(null)
  }, [stop])

  // 언마운트 시 진행 중 스트림 취소
  useEffect(() => () => stop(), [stop])

  return { output, status, error, latency, run, stop, reset }
}
