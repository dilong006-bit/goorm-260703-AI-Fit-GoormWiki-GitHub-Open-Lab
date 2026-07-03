import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SearchBox } from '@/components/common/SearchBox'
import { RepositoryGrid } from '@/components/repository/RepositoryGrid'
import { GridSkeleton } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { Card } from '@/components/ui/card'
import { CATEGORIES } from '@/constants/categories'
import { useRepositories } from '@/hooks/useRepositories'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/types'
import { sortRepos } from '@/utils/filterRepos'
import { env } from '@/config/env'

export function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
    <div className="space-y-14">
      {/* Hero */}
      <section className="bg-hero-glow relative -mx-4 space-y-6 rounded-3xl px-4 py-12 text-center sm:py-16">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            {t('home.hero.badge')}
          </span>
          <h1 className="text-gradient text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t('home.hero.title')}
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {t('home.hero.subtitle', { user: `@${env.githubUsername}` })}
          </p>
        </div>
        <div className="mx-auto max-w-xl">
          <SearchBox onSubmit={goSearch} autoFocus />
        </div>
      </section>

      {/* 카테고리 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('home.section.categories')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Card className="flex h-full flex-col items-center gap-2.5 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-medium">
                    {t(`category.${cat.slug}.label` as TranslationKey)}
                  </span>
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
          <div className="space-y-4">
            <SectionHeader
              title={t('home.section.popular')}
              to="/search?sort=stars"
              moreLabel={t('common.viewMore')}
            />
            {loading ? (
              <GridSkeleton count={4} />
            ) : (
              <RepositoryGrid repos={popular} />
            )}
          </div>

          {/* 최근 업데이트 */}
          <div className="space-y-4">
            <SectionHeader
              title={t('home.section.recent')}
              to="/search"
              moreLabel={t('common.viewMore')}
            />
            {loading ? (
              <GridSkeleton count={4} />
            ) : (
              <RepositoryGrid repos={recent} />
            )}
          </div>

          {/* 전체 목록 */}
          <div className="space-y-4">
            <SectionHeader
              title={t('home.section.all', { count: repositories.length })}
              to="/search"
              moreLabel={t('common.viewMore')}
            />
            {loading ? (
              <GridSkeleton />
            ) : (
              <RepositoryGrid repos={sortRepos(repositories, 'updated')} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function SectionHeader({
  title,
  to,
  moreLabel,
}: {
  title: string
  to: string
  moreLabel: string
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Link
        to={to}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {moreLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
