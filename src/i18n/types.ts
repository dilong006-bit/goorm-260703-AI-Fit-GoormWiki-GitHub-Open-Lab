import type { TranslationKey } from './locales/ko'

export type Locale = 'ko' | 'en'
export type { TranslationKey }

export const LOCALE_STORAGE_KEY = 'nextwiki:lang'

/** Intl 로케일 태그 매핑 (날짜 등 포맷용). */
export const INTL_LOCALE: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
}
