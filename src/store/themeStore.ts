import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'nextwiki:theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system'
}

function resolve(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

/** <html>에 .dark 클래스를 반영한다. */
function applyToDom(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

interface ThemeState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  /** 라이트 ↔ 다크 즉시 토글 (system은 현재 실제 테마의 반대로) */
  toggle: () => void
  /** OS 테마 변경 시 system 모드에서 재계산 */
  syncSystem: () => void
}

const initialTheme = getStoredTheme()

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: resolve(initialTheme),

  setTheme: (theme) => {
    const resolvedTheme = resolve(theme)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme)
    }
    applyToDom(resolvedTheme)
    set({ theme, resolvedTheme })
  },

  toggle: () => {
    const next: Theme = get().resolvedTheme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },

  syncSystem: () => {
    if (get().theme !== 'system') return
    const resolvedTheme = getSystemTheme()
    applyToDom(resolvedTheme)
    set({ resolvedTheme })
  },
}))
