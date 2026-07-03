import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

export function Loading({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground',
        className,
      )}
    >
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm">{label ?? t('common.loading')}</p>
    </div>
  )
}

/** 카드 그리드용 스켈레톤 (shimmer). */
export function CardSkeleton() {
  return (
    <div className="shimmer rounded-xl border bg-card p-6">
      <div className="mb-4 h-5 w-2/3 rounded-md bg-muted" />
      <div className="mb-2 h-3 w-full rounded bg-muted" />
      <div className="mb-6 h-3 w-4/5 rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
