import axios, { type AxiosInstance } from 'axios'
import { GITHUB_API_BASE, env } from '@/config/env'

/** GitHub REST API용 Axios 인스턴스. 토큰이 있으면 Authorization 헤더 부착. */
export const githubApi: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(env.githubToken
      ? { Authorization: `Bearer ${env.githubToken}` }
      : {}),
  },
})

export class GitHubApiError extends Error {
  status?: number
  isRateLimit: boolean

  constructor(message: string, status?: number, isRateLimit = false) {
    super(message)
    this.name = 'GitHubApiError'
    this.status = status
    this.isRateLimit = isRateLimit
  }
}

/** Axios 에러를 사람이 읽을 수 있는 GitHubApiError로 정규화. */
export function normalizeError(err: unknown): GitHubApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const remaining = err.response?.headers?.['x-ratelimit-remaining']
    const isRateLimit = status === 403 && remaining === '0'

    if (isRateLimit) {
      return new GitHubApiError(
        'GitHub API 요청 한도(Rate Limit)를 초과했습니다. 잠시 후 다시 시도하거나 .env에 VITE_GITHUB_TOKEN을 설정하세요.',
        status,
        true,
      )
    }
    if (status === 404) {
      return new GitHubApiError('요청한 리소스를 찾을 수 없습니다.', status)
    }
    return new GitHubApiError(
      err.response?.statusText || err.message || '네트워크 오류가 발생했습니다.',
      status,
    )
  }
  return new GitHubApiError(
    err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
  )
}
