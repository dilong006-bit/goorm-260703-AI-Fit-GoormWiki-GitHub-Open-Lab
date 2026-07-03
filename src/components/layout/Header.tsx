import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { SearchBox } from '@/components/common/SearchBox'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

export function Header() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  /**
   * 버그 수정 #1: 검색어가 있을 때만 /search로 이동한다.
   * 빈 검색어로는 절대 navigate 하지 않아 강제 리다이렉트를 방지.
   */
  const goSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/search', label: t('nav.search'), end: false },
    { to: '/about', label: t('nav.about'), end: false },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shadow-primary/30">
            <BookOpen className="size-4" />
          </span>
          <span className="hidden sm:inline">{t('brand.name')}</span>
        </Link>

        <div className="mx-2 hidden max-w-sm flex-1 md:block">
          <SearchBox
            onSubmit={goSearch}
            placeholder={t('searchBox.placeholderShort')}
          />
        </div>

        <nav className="ml-auto flex items-center gap-0.5 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 pl-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
