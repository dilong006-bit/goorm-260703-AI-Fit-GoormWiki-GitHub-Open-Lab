import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

/**
 * 테마 스토어를 DOM과 동기화하는 훅.
 * - 마운트 시 저장된 테마를 적용
 * - system 모드일 때 OS 테마 변경(matchMedia)에 실시간 반응
 * AppLayout(최상위)에서 1회 사용한다.
 */
export function useTheme() {
  const { theme, resolvedTheme, setTheme, toggle, syncSystem } =
    useThemeStore()

  // 초기 DOM 반영 (인라인 스크립트와 상태 정합성 보장)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    // 최초 1회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // OS 테마 변화 구독
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => syncSystem()
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [syncSystem])

  return { theme, resolvedTheme, setTheme, toggle }
}
