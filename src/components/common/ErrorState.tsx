import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold">문제가 발생했습니다</p>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          다시 시도
        </Button>
      )}
    </div>
  )
}

/** 결과 없음 상태. */
export function EmptyState({
  message = '표시할 프로젝트가 없습니다.',
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  )
}
