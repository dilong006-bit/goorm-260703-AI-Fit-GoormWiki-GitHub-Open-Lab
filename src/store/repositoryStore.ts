import { create } from 'zustand'
import type { Repository } from '@/types/repository'
import { fetchAllRepositories } from '@/services/github/repository'

interface RepositoryState {
  repositories: Repository[]
  loading: boolean
  error: string | null
  loaded: boolean

  loadRepositories: (force?: boolean) => Promise<void>
  getByName: (name: string) => Repository | undefined
}

export const useRepositoryStore = create<RepositoryState>((set, get) => ({
  repositories: [],
  loading: false,
  error: null,
  loaded: false,

  loadRepositories: async (force = false) => {
    // 이미 로드되어 있고 강제 새로고침이 아니면 스킵
    if (get().loaded && !force) return
    set({ loading: true, error: null })
    try {
      const repos = await fetchAllRepositories(undefined, { force })
      set({ repositories: repos, loading: false, loaded: true })
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : '저장소를 불러오지 못했습니다.',
      })
    }
  },

  getByName: (name) =>
    get().repositories.find(
      (r) => r.name.toLowerCase() === name.toLowerCase(),
    ),
}))
