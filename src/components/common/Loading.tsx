import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Loading({
  label = '불러오는 중…',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground',
        className,
      )}
    >
      <Loader2 className="size-8 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

/** 카드 그리드용 스켈레톤. */
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-6">
      <div className="mb-4 h-5 w-2/3 rounded bg-muted" />
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
