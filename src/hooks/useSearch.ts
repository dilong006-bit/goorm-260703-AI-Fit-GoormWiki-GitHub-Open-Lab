import { useMemo, useState } from 'react'
import { useRepositories } from './useRepositories'
import { useDebounce } from './useDebounce'
import {
  filterByLanguage,
  searchRepos,
  sortRepos,
  type SortKey,
} from '@/utils/filterRepos'

/**
 * 검색 페이지용 훅.
 * 키워드(debounce) + 언어 필터 + 정렬을 조합한 결과를 메모이즈한다.
 */
export function useSearch(initialQuery = '') {
  const { repositories, loading, error } = useRepositories()
  const [query, setQuery] = useState(initialQuery)
  const [language, setLanguage] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('updated')

  const debouncedQuery = useDebounce(query, 300)

  const results = useMemo(() => {
    let list = searchRepos(repositories, debouncedQuery)
    list = filterByLanguage(list, language)
    return sortRepos(list, sort)
  }, [repositories, debouncedQuery, language, sort])

  return {
    query,
    setQuery,
    language,
    setLanguage,
    sort,
    setSort,
    results,
    loading,
    error,
    total: repositories.length,
  }
}
