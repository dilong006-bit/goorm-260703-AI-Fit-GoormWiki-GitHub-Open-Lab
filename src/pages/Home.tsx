import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SearchBox } from '@/components/common/SearchBox'
import { RepositoryGrid } from '@/components/repository/RepositoryGrid'
import { GridSkeleton } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { Card } from '@/components/ui/card'
import { CATEGORIES } from '@/constants/categories'
import { useRepositories } from '@/hooks/useRepositories'
import { sortRepos } from '@/utils/filterRepos'
import { env } from '@/config/env'

export function Home() {
  const navigate = useNavigate()
  const { repositories, loading, error, reload } = useRepositories()

  const recent = useMemo(
    () => sortRepos(repositories, 'updated').slice(0, 4),
    [repositories],
  )
  const popular = useMemo(
    () => sortRepos(repositories, 'stars').slice(0, 4),
    [repositories],
  )

  // 버그 수정 #1: 검색어가 있을 때만 /search로 이동
  const goSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-6 py-8 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            GitHub Open Lab
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            <span className="font-medium text-foreground">
              @{env.githubUsername}
            </span>
            의 오픈소스 프로젝트를 학습자 친화적인 Wiki로 탐색하세요.
          </p>
        </div>
        <div className="mx-auto max-w-xl">
          <SearchBox onSubmit={goSearch} autoFocus />
        </div>
      </section>

      {/* 카테고리 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">카테고리</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Card className="flex h-full flex-col items-center gap-2 p-5 text-center transition-colors hover:bg-accent">
                  <Icon className="size-6 text-primary" />
                  <span className="font-medium">{cat.label}</span>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {error && <ErrorState message={error} onRetry={reload} />}

      {!error && (
        <>
          {/* 인기 프로젝트 */}
          <SectionHeader title="인기 프로젝트" to="/search?sort=stars" />
          {loading ? (
            <GridSkeleton count={4} />
          ) : (
            <RepositoryGrid repos={popular} />
          )}

          {/* 최근 업데이트 */}
          <SectionHeader title="최근 업데이트" to="/search" />
          {loading ? (
            <GridSkeleton count={4} />
          ) : (
            <RepositoryGrid repos={recent} />
          )}

          {/* 전체 목록 */}
          <SectionHeader
            title={`전체 프로젝트 (${repositories.length})`}
            to="/search"
          />
          {loading ? (
            <GridSkeleton />
          ) : (
            <RepositoryGrid repos={sortRepos(repositories, 'updated')} />
          )}
        </>
      )}
    </div>
  )
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between pt-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Link
        to={to}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        더보기 <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
