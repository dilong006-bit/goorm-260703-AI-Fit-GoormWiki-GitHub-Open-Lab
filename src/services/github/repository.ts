import { githubApi, normalizeError } from './api'
import { cache } from './cache'
import { PER_PAGE, env } from '@/config/env'
import type {
  GitHubRepo,
  ReadmeContent,
  Repository,
} from '@/types/repository'
import { resolveReadmeAssets } from '@/utils/readmeImages'

/** 원본 GitHubRepo → 앱 내부 Repository 정규화. */
function normalizeRepo(raw: GitHubRepo): Repository {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description ?? '',
    htmlUrl: raw.html_url,
    homepage: raw.homepage || null,
    language: raw.language,
    topics: raw.topics ?? [],
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    watchers: raw.watchers_count,
    openIssues: raw.open_issues_count,
    defaultBranch: raw.default_branch,
    isFork: raw.fork,
    isArchived: raw.archived,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    owner: {
      login: raw.owner.login,
      avatarUrl: raw.owner.avatar_url,
      htmlUrl: raw.owner.html_url,
    },
    license: raw.license?.name ?? null,
  }
}

/**
 * 사용자의 모든 public repository를 페이지네이션으로 조회(200개 이상 지원).
 * 24시간 캐시 우선, 실패 시 API 폴백.
 */
export async function fetchAllRepositories(
  username = env.githubUsername,
  { force = false }: { force?: boolean } = {},
): Promise<Repository[]> {
  const cacheKey = `repos:${username}`
  if (!force) {
    const cached = cache.get<Repository[]>(cacheKey)
    if (cached) return cached
  }

  try {
    const all: GitHubRepo[] = []
    let page = 1

    // 페이지가 가득 차 있는 동안 계속 조회 (200개+ 대응)
    while (true) {
      const { data } = await githubApi.get<GitHubRepo[]>(
        `/users/${username}/repos`,
        {
          params: {
            per_page: PER_PAGE,
            page,
            sort: 'pushed',
            direction: 'desc',
            type: 'owner',
          },
        },
      )
      all.push(...data)
      if (data.length < PER_PAGE) break
      page += 1
      if (page > 20) break // 2000개 안전장치
    }

    const repos = all
      .filter((r) => !r.fork) // 포크 저장소 제외
      .map(normalizeRepo)

    cache.set(cacheKey, repos)
    return repos
  } catch (err) {
    throw normalizeError(err)
  }
}

/** 이름으로 단일 저장소 조회 (목록 캐시 우선). */
export async function fetchRepository(
  name: string,
  username = env.githubUsername,
): Promise<Repository> {
  const repos = await fetchAllRepositories(username)
  const found = repos.find(
    (r) => r.name.toLowerCase() === name.toLowerCase(),
  )
  if (found) return found

  // 캐시에 없으면 직접 조회
  try {
    const { data } = await githubApi.get<GitHubRepo>(
      `/repos/${username}/${name}`,
    )
    return normalizeRepo(data)
  } catch (err) {
    throw normalizeError(err)
  }
}

/** README 조회 + 상대경로 이미지 변환. README가 없으면 null. */
export async function fetchReadme(
  repo: Repository,
): Promise<ReadmeContent | null> {
  const cacheKey = `readme:${repo.fullName}`
  const cached = cache.get<ReadmeContent>(cacheKey)
  if (cached) return cached

  try {
    // .raw 미디어 타입으로 원본 마크다운을 바로 수신
    const { data } = await githubApi.get<string>(
      `/repos/${repo.fullName}/readme`,
      {
        headers: { Accept: 'application/vnd.github.raw+json' },
        transformResponse: (d) => d, // 문자열 그대로 유지
      },
    )

    const resolved = resolveReadmeAssets(
      data,
      repo.owner.login,
      repo.name,
      repo.defaultBranch,
    )
    const result: ReadmeContent = {
      markdown: resolved,
      baseUrl: `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.defaultBranch}`,
    }
    cache.set(cacheKey, result)
    return result
  } catch (err) {
    const normalized = normalizeError(err)
    if (normalized.status === 404) return null // README 없음은 정상 케이스
    throw normalized
  }
}
