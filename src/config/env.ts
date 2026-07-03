/**
 * 환경 변수 중앙 관리.
 * VITE_GITHUB_USERNAME 미설정 시 기본값(dilong006-bit)으로 폴백한다.
 */
export const env = {
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME || 'dilong006-bit',
  githubToken: import.meta.env.VITE_GITHUB_TOKEN || '',
} as const

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24시간
export const GITHUB_API_BASE = 'https://api.github.com'
export const PER_PAGE = 100 // GitHub API 최대값
