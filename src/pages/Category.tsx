import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { RepositoryGrid } from '@/components/repository/RepositoryGrid'
import { GridSkeleton } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { useRepositories } from '@/hooks/useRepositories'
import { filterByCategory, sortRepos } from '@/utils/filterRepos'
import { getCategoryBySlug } from '@/constants/categories'

export function Category() {
  const { name = '' } = useParams()
  const { repositories, loading, error, reload } = useRepositories()
  const category = getCategoryBySlug(name)

  const repos = useMemo(
    () => sortRepos(filterByCategory(repositories, name), 'updated'),
    [repositories, name],
  )

  if (!category) {
    return (
      <ErrorState message={`'${name}' 카테고리를 찾을 수 없습니다.`} />
    )
  }

  const Icon = category.icon

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 홈으로
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">{category.label}</h1>
          <p className="text-sm text-muted-foreground">
            {category.description} · {repos.length}개 프로젝트
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <GridSkeleton />
      ) : (
        <RepositoryGrid
          repos={repos}
          emptyMessage="이 카테고리에 해당하는 프로젝트가 아직 없습니다."
        />
      )}
    </div>
  )
}
