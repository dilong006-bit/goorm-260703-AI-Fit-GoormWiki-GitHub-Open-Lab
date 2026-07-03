import { useEffect } from 'react'
import { useRepositoryStore } from '@/store/repositoryStore'

/**
 * 저장소 목록을 보장 로드하는 훅.
 * 컴포넌트 마운트 시 스토어가 비어있으면 자동으로 fetch.
 */
export function useRepositories() {
  const { repositories, loading, error, loaded, loadRepositories } =
    useRepositoryStore()

  useEffect(() => {
    void loadRepositories()
  }, [loadRepositories])

  return {
    repositories,
    loading,
    error,
    loaded,
    reload: () => loadRepositories(true),
  }
}
