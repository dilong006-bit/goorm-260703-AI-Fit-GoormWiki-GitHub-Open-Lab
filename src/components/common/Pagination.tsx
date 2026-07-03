import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  const pages = getPageRange(page, totalPages)

  return (
    <nav
      className="flex items-center justify-center gap-1 pt-4"
      aria-label={t('pagination.aria')}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('pagination.prev')}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange(p)}
            className={cn('tabular-nums')}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('pagination.next')}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

/** 현재 페이지 주변 + 처음/끝 페이지를 생략(...) 포함하여 반환. */
function getPageRange(page: number, total: number): (number | '...')[] {
  const delta = 1
  const range: (number | '...')[] = []
  const left = Math.max(2, page - delta)
  const right = Math.min(total - 1, page + delta)

  range.push(1)
  if (left > 2) range.push('...')
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push('...')
  if (total > 1) range.push(total)

  return range
}
