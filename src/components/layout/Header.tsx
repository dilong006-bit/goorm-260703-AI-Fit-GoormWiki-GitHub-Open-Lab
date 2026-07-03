import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { SearchBox } from '@/components/common/SearchBox'

export function Header() {
  const navigate = useNavigate()

  /**
   * 버그 수정 #1: 검색어가 있을 때만 /search로 이동한다.
   * 빈 검색어로는 절대 navigate 하지 않아 강제 리다이렉트를 방지.
   */
  const goSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span className="hidden sm:inline">AI-Fit GoormWiki</span>
        </Link>

        <div className="hidden max-w-md flex-1 md:block">
          <SearchBox onSubmit={goSearch} placeholder="프로젝트 검색…" />
        </div>

        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            홈
          </Link>
          <Link
            to="/search"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            검색
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  )
}
