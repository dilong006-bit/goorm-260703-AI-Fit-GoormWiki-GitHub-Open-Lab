import { CACHE_TTL_MS } from '@/config/env'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const PREFIX = 'nextwiki:'

/** localStorage 기반 TTL 캐시(기본 24시간). SSR-safe 가드 포함. */
export const cache = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (!raw) return null
      const entry = JSON.parse(raw) as CacheEntry<T>
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(PREFIX + key)
        return null
      }
      return entry.data
    } catch {
      return null
    }
  },

  set<T>(key: string, data: T, ttl = CACHE_TTL_MS): void {
    if (typeof window === 'undefined') return
    try {
      const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttl }
      localStorage.setItem(PREFIX + key, JSON.stringify(entry))
    } catch {
      // 용량 초과 등은 무시 (캐시는 best-effort)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(PREFIX + key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
}
