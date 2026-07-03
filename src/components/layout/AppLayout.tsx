import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { useTheme } from '@/hooks/useTheme'

export function AppLayout() {
  const { pathname } = useLocation()

  // 테마 시스템 초기화 (최상위에서 1회 — OS 테마 구독 포함)
  useTheme()

  // 라우트 전환 시 스크롤 최상단 복귀
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
