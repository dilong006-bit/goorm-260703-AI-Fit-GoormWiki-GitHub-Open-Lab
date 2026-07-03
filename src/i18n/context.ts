import { createContext } from 'react'
import type { Locale, TranslationKey } from './types'

export interface I18nContextValue {
  locale: Locale
  /** Intl 로케일 태그 (예: 'ko-KR') */
  intlLocale: string
  setLocale: (locale: Locale) => void
  /** 번역 함수. `{{var}}` 보간 지원. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
