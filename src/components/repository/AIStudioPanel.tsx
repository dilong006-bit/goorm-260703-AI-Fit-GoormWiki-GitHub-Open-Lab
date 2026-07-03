import { useMemo, useState } from 'react'
import { Check, Copy, Loader2, Sparkles, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownViewer } from '@/components/repository/MarkdownViewer'
import { ProviderPicker } from '@/components/repository/ProviderPicker'
import { ErrorState } from '@/components/common/ErrorState'
import { useAIContent } from '@/hooks/useAIContent'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/types'
import {
  availableProviders,
  defaultProvider,
  models,
  type ProviderName,
} from '@/llm'
import { CONTENT_PROFILES } from '@/services/ai/providerProfiles'
import type { ContentType } from '@/services/ai/prompts'
import type { Repository } from '@/types/repository'
import { cn } from '@/lib/utils'

const TYPES: ContentType[] = [
  'brief',
  'roadmap',
  'quiz',
  'translate',
  'qna',
  'trend',
]

function firstModel(p: ProviderName): string {
  return Object.keys(models[p] ?? {})[0] ?? ''
}

export function AIStudioPanel({
  repo,
  readme,
}: {
  repo: Repository
  readme: string | null
}) {
  const { t, locale } = useTranslation()
  const providers = useMemo(() => availableProviders(), [])

  const recommendedProvider = (type: ContentType): ProviderName => {
    const rec = CONTENT_PROFILES[type].recommended
    return providers.includes(rec) ? rec : defaultProvider()
  }
  const recommendedModel = (type: ContentType, p: ProviderName): string => {
    const opts = Object.keys(models[p] ?? {})
    const preferred = CONTENT_PROFILES[type].model
    if (p === CONTENT_PROFILES[type].recommended && opts.includes(preferred)) {
      return preferred
    }
    return opts[0] ?? ''
  }

  const initialType: ContentType = 'brief'
  const initialProvider = recommendedProvider(initialType)
  const [type, setType] = useState<ContentType>(initialType)
  const [provider, setProvider] = useState<ProviderName>(initialProvider)
  const [model, setModel] = useState(
    recommendedModel(initialType, initialProvider),
  )
  const [question, setQuestion] = useState('')
  const [copied, setCopied] = useState(false)

  const { output, status, error, latency, run, stop, reset } = useAIContent()
  const isStreaming = status === 'streaming'

  const selectType = (next: ContentType) => {
    const p = recommendedProvider(next)
    setType(next)
    setProvider(p)
    setModel(recommendedModel(next, p))
    reset()
  }
  const selectProvider = (p: ProviderName) => {
    setProvider(p)
    setModel(firstModel(p))
    reset()
  }
  const selectModel = (m: string) => {
    setModel(m)
    reset()
  }

  const canGenerate =
    !isStreaming && (type !== 'qna' || question.trim().length > 0)

  const generate = () => {
    if (!canGenerate) return
    void run({
      repo,
      readme: readme ?? '',
      type,
      provider,
      model,
      locale,
      question: type === 'qna' ? question.trim() : undefined,
    })
  }

  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard 미지원 무시 */
    }
  }

  return (
    <section className="rounded-xl border">
      <header className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <Sparkles className="size-4 text-primary" />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight">{t('ai.title')}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t('ai.subtitle')}
          </p>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {/* 콘텐츠 유형 탭 */}
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => selectType(tp)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                type === tp
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent',
              )}
            >
              {t(`ai.type.${tp}` as TranslationKey)}
            </button>
          ))}
        </div>

        <ProviderPicker
          providers={providers}
          provider={provider}
          model={model}
          recommended={recommendedProvider(type)}
          onProviderChange={selectProvider}
          onModelChange={selectModel}
          disabled={isStreaming}
        />

        {type === 'qna' && (
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('ai.questionPlaceholder')}
            disabled={isStreaming}
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={generate} disabled={!canGenerate}>
            {isStreaming ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {output ? t('ai.regenerate') : t('ai.generate')}
          </Button>

          {isStreaming && (
            <Button variant="outline" onClick={stop}>
              <Square className="size-3.5" /> {t('ai.stop')}
            </Button>
          )}

          {latency != null && (
            <Badge variant="secondary" className="font-normal tabular-nums">
              {t('ai.latency', { ms: latency })}
            </Badge>
          )}

          {output && !isStreaming && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copy}
              className="ml-auto"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? t('ai.copied') : t('ai.copy')}
            </Button>
          )}
        </div>

        {provider === 'mock' && (
          <p className="rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            {t('ai.mockNotice')}
          </p>
        )}

        {/* 출력 */}
        {error ? (
          <ErrorState message={error} onRetry={generate} />
        ) : output ? (
          <div className="overflow-x-auto rounded-lg border bg-card p-4">
            <MarkdownViewer content={output} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />
            )}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {isStreaming ? t('ai.streaming') : t('ai.placeholder')}
          </p>
        )}
      </div>
    </section>
  )
}
