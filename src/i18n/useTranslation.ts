import { useContext } from 'react'
import { I18nContext } from './context'

/** 번역·로케일 접근 훅. I18nProvider 하위에서만 사용. */
export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within <I18nProvider>')
  }
  return ctx
}
