import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBox } from '@/components/common/SearchBox'
import { Filter } from '@/components/common/Filter'
import { RepositoryGrid } from '@/components/repository/RepositoryGrid'
import { Pagination } from '@/components/common/Pagination'
import { GridSkeleton } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { useSearch } from '@/hooks/useSearch'
import { extractLanguages, type SortKey } from '@/utils/filterRepos'
import { useRepositories } from '@/hooks/useRepositories'
import { useTranslation } from '@/i18n/useTranslation'

const PAGE_SIZE = 12

export function Search() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const initialSort = (searchParams.get('sort') as SortKey) || 'updated'

  const {
    query,
    setQuery,
    language,
    setLanguage,
    sort,
    setSort,
    results,
    loading,
    error,
    total,
  } = useSearch(initialQuery)

  const { repositories, reload } = useRepositories()
  const languages = useMemo(
    () => extractLanguages(repositories),
    [repositories],
  )

  const [page, setPage] = useState(1)

  // 초기 sort 파라미터 반영 (최초 1회)
  useEffect(() => {
    if (initialSort !== sort) setSort(initialSort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // URL query(q) → 입력값 동기화 (뒤로가기/딥링크 대응)
  useEffect(() => {
    setQuery(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // 필터/검색어 변경 시 첫 페이지로
  useEffect(() => {
    setPage(1)
  }, [query, language, sort])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 검색어를 URL에 반영 (직접 입력 시)
  const handleSearchInput = (q: string) => {
    setQuery(q)
    const next = new URLSearchParams(searchParams)
    if (q.trim()) next.set('q', q.trim())
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('search.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('search.resultInfo', { total, count: results.length })}
        </p>
      </div>

      <SearchBox
        defaultValue={initialQuery}
        onSearch={handleSearchInput}
        onSubmit={handleSearchInput}
      />

      <Filter
        languages={languages}
        activeLanguage={language}
        onLanguageChange={setLanguage}
        sort={sort}
        onSortChange={setSort}
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <GridSkeleton />
      ) : (
        <>
          <RepositoryGrid repos={paged} emptyMessage={t('search.empty')} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  )
}
