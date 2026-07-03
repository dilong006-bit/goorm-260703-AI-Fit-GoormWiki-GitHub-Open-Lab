import { Badge } from '@/components/ui/badge'
import { getLanguageColor } from '@/constants/languages'
import { cn } from '@/lib/utils'
import type { SortKey } from '@/utils/filterRepos'

interface FilterProps {
  languages: string[]
  activeLanguage: string | null
  onLanguageChange: (lang: string | null) => void
  sort: SortKey
  onSortChange: (sort: SortKey) => void
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'updated', label: '최근 업데이트' },
  { key: 'stars', label: 'Star 많은순' },
  { key: 'name', label: '이름순' },
]

export function Filter({
  languages,
  activeLanguage,
  onLanguageChange,
  sort,
  onSortChange,
}: FilterProps) {
  return (
    <div className="space-y-4">
      {languages.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onLanguageChange(null)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              !activeLanguage
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:bg-accent',
            )}
          >
            전체
          </button>
          {languages.map((lang) => {
            const active = activeLanguage === lang
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(active ? null : lang)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent',
                )}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang) }}
                />
                {lang}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">정렬</span>
        {SORT_OPTIONS.map((opt) => (
          <Badge
            key={opt.key}
            variant={sort === opt.key ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onSortChange(opt.key)}
          >
            {opt.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
