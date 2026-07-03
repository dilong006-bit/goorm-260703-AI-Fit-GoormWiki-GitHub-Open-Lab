import { useTranslation } from '@/i18n/useTranslation'
import type { Locale } from '@/i18n/types'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Locale; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
]

/** KO / EN 세그먼트 스위처. */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className="inline-flex items-center rounded-full border bg-muted/50 p-0.5 text-xs font-semibold"
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-2.5 py-1 transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
