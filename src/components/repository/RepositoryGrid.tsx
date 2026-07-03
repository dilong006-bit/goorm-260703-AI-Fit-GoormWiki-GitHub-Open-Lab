import { RepositoryCard } from './RepositoryCard'
import { EmptyState } from '@/components/common/ErrorState'
import type { Repository } from '@/types/repository'

/**
 * 반응형 저장소 그리드.
 * 모바일 1열 · 태블릿 2열 · 데스크톱 4열 (스펙 요구사항).
 */
export function RepositoryGrid({
  repos,
  emptyMessage,
}: {
  repos: Repository[]
  emptyMessage?: string
}) {
  if (repos.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {repos.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
