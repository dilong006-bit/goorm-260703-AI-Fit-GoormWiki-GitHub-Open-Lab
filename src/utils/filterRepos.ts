import type { Repository } from '@/types/repository'
import { CATEGORIES, getCategoryBySlug } from '@/constants/categories'

/** 검색어(이름·설명·언어·토픽)로 필터링. */
export function searchRepos(repos: Repository[], query: string): Repository[] {
  const q = query.trim().toLowerCase()
  if (!q) return repos
  return repos.filter((r) => {
    const haystack = [
      r.name,
      r.description,
      r.language ?? '',
      ...r.topics,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

/** 특정 언어로 필터링. */
export function filterByLanguage(
  repos: Repository[],
  language: string | null,
): Repository[] {
  if (!language) return repos
  return repos.filter(
    (r) => (r.language ?? '').toLowerCase() === language.toLowerCase(),
  )
}

/** 카테고리 slug로 필터링 (언어 + 토픽 키워드 매칭). */
export function filterByCategory(
  repos: Repository[],
  slug: string,
): Repository[] {
  const category = getCategoryBySlug(slug)
  if (!category) return repos

  // ETC: 다른 어느 카테고리에도 속하지 않는 저장소
  if (category.slug === 'etc') {
    return repos.filter((r) => !matchesAnyKnownCategory(r))
  }

  return repos.filter((r) => matchesCategory(r, category.keywords))
}

function matchesCategory(repo: Repository, keywords: string[]): boolean {
  if (keywords.length === 0) return false
  const lang = (repo.language ?? '').toLowerCase()
  const topics = repo.topics.map((t) => t.toLowerCase())
  return keywords.some(
    (kw) => lang === kw || lang.includes(kw) || topics.includes(kw),
  )
}

function matchesAnyKnownCategory(repo: Repository): boolean {
  return CATEGORIES.filter((c) => c.slug !== 'etc').some((c) =>
    matchesCategory(repo, c.keywords),
  )
}

/** 저장소 목록에서 실제 존재하는 언어 목록을 추출(개수 내림차순). */
export function extractLanguages(repos: Repository[]): string[] {
  const counts = new Map<string, number>()
  for (const r of repos) {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang)
}

export type SortKey = 'updated' | 'stars' | 'name'

/** 정렬. */
export function sortRepos(repos: Repository[], key: SortKey): Repository[] {
  const copy = [...repos]
  switch (key) {
    case 'stars':
      return copy.sort((a, b) => b.stars - a.stars)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'updated':
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
      )
  }
}
