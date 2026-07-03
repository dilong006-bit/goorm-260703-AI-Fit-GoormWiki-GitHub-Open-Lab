import { useCallback, useMemo, useState } from 'react'
import { I18nContext, type I18nContextValue } from './context'
import { ko } from './locales/ko'
import { en } from './locales/en'
import {
  INTL_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
  type TranslationKey,
} from './types'

const DICTIONARIES = { ko, en } as const

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'ko' || stored === 'en') return stored
  return (navigator.language || 'en').toLowerCase().startsWith('ko')
    ? 'ko'
    : 'en'
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{{${key}}}`,
  )
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
      document.documentElement.setAttribute('lang', next)
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const dict = DICTIONARIES[locale]
      const template = dict[key] ?? ko[key] ?? key
      return interpolate(template, vars)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, intlLocale: INTL_LOCALE[locale], setLocale, t }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
