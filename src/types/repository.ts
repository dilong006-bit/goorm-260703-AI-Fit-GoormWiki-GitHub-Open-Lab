/** GitHub REST API가 반환하는 Repository 원본(필요 필드만). */
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  default_branch: string
  fork: boolean
  archived: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
  license: {
    key: string
    name: string
    spdx_id: string
  } | null
}

/** 앱 내부에서 사용하는 정규화된 Repository. */
export interface Repository {
  id: number
  name: string
  fullName: string
  description: string
  htmlUrl: string
  homepage: string | null
  language: string | null
  topics: string[]
  stars: number
  forks: number
  watchers: number
  openIssues: number
  defaultBranch: string
  isFork: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
  pushedAt: string
  owner: {
    login: string
    avatarUrl: string
    htmlUrl: string
  }
  license: string | null
}

/**
 * Phase 2 확장 대비 메타데이터.
 * README front-matter, 큐레이션 정보, 난이도 태그 등을 담을 수 있도록 미리 정의.
 */
export interface RepositoryMeta {
  repositoryId: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  featured?: boolean
  order?: number
  curatorNote?: string
  tags?: string[]
}

/** README fetch 결과. */
export interface ReadmeContent {
  markdown: string
  /** 이미지 상대경로 변환에 필요한 raw base URL */
  baseUrl: string
}
