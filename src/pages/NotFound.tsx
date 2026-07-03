import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-5xl font-bold text-muted-foreground">404</p>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className={buttonVariants()}>
        홈으로 돌아가기
      </Link>
    </div>
  )
}
