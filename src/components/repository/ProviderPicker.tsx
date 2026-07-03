import { models, type ProviderName } from '@/llm'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

const PROVIDER_LABEL: Record<ProviderName, string> = {
  mock: 'Mock',
  openai: 'OpenAI',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
}

interface ProviderPickerProps {
  providers: ProviderName[]
  provider: ProviderName
  model: string
  recommended: ProviderName
  onProviderChange: (p: ProviderName) => void
  onModelChange: (m: string) => void
  disabled?: boolean
}

export function ProviderPicker({
  providers,
  provider,
  model,
  recommended,
  onProviderChange,
  onModelChange,
  disabled,
}: ProviderPickerProps) {
  const { t } = useTranslation()
  const modelOptions = Object.keys(models[provider] ?? {})

  const selectCls =
    'h-9 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {t('ai.provider')}
      </span>
      <select
        value={provider}
        disabled={disabled}
        onChange={(e) => onProviderChange(e.target.value as ProviderName)}
        className={cn(selectCls)}
        aria-label={t('ai.provider')}
      >
        {providers.map((p) => (
          <option key={p} value={p}>
            {PROVIDER_LABEL[p]}
            {p === recommended ? ' ★' : ''}
          </option>
        ))}
      </select>

      <select
        value={model}
        disabled={disabled}
        onChange={(e) => onModelChange(e.target.value)}
        className={cn(selectCls)}
        aria-label="model"
      >
        {modelOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {provider === recommended && (
        <Badge variant="secondary" className="font-normal">
          {t('ai.recommended')}
        </Badge>
      )}
    </div>
  )
}
