import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface SearchBoxProps {
  /** 초기 검색어 (URL query 동기화용) */
  defaultValue?: string
  placeholder?: string
  /**
   * 디바운스된 검색 콜백.
   * 버그 수정 #1: 사용자가 "직접 입력"한 경우에만 호출된다.
   * 마운트·리렌더 시 빈 값으로 자동 호출되지 않는다.
   */
  onSearch?: (query: string) => void
  /** Enter 제출 콜백 */
  onSubmit?: (query: string) => void
  className?: string
  autoFocus?: boolean
}

export function SearchBox({
  defaultValue = '',
  placeholder,
  onSearch,
  onSubmit,
  className,
  autoFocus,
}: SearchBoxProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  // 사용자가 실제로 타이핑했는지 추적하는 플래그 (마운트 시 false)
  const userTypedRef = useRef(false)
  const debounced = useDebounce(value, 350)

  // defaultValue(외부 URL query)가 바뀌면 입력값 동기화 — 사용자 입력으로 간주하지 않음
  useEffect(() => {
    setValue(defaultValue)
    userTypedRef.current = false
  }, [defaultValue])

  useEffect(() => {
    // 사용자가 직접 입력한 경우에만 검색 실행 (빈 값 자동 navigate 방지)
    if (!userTypedRef.current) return
    onSearch?.(debounced)
    // onSearch는 안정 참조가 아닐 수 있어 debounced에만 반응
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userTypedRef.current = true
    setValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value.trim())
  }

  const handleClear = () => {
    userTypedRef.current = true
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full', className)}
      role="search"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder ?? t('searchBox.placeholder')}
        aria-label={t('searchBox.aria')}
        autoFocus={autoFocus}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t('searchBox.clear')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  )
}
