import { useEffect, useState } from 'react'

/** 값이 delay(ms) 동안 안정될 때까지 갱신을 지연시킨다. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
