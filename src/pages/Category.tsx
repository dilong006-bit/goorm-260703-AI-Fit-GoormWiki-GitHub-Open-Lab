import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { RepositoryGrid } from '@/components/repository/RepositoryGrid'
import { GridSkeleton } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { useRepositories } from '@/hooks/useRepositories'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/types'
import { filterByCategory, sortRepos } from '@/utils/filterRepos'
import { getCategoryBySlug } from '@/constants/categories'

export function Category() {
  const { name = '' } = useParams()
  const { t } = useTranslation()
  const { repositories, loading, error, reload } = useRepositories()
  const category = getCategoryBySlug(name)

  const repos = useMemo(
    () => sortRepos(filterByCategory(repositories, name), 'updated'),
    [repositories, name],
  )

  if (!category) {
    return <ErrorState message={t('category.notFound', { name })} />
  }

  const Icon = category.icon

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t('category.back')}
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">
            {t(`category.${category.slug}.label` as TranslationKey)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(`category.${category.slug}.desc` as TranslationKey)} ·{' '}
            {t('category.countSuffix', { count: repos.length })}
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <GridSkeleton />
      ) : (
        <RepositoryGrid repos={repos} emptyMessage={t('category.empty')} />
      )}
    </div>
  )
}
