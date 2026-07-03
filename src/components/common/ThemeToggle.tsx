import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/i18n/useTranslation'

/**
 * 라이트 ↔ 다크 토글 버튼.
 * 현재 실제 테마의 반대로 전환하며, 아이콘이 부드럽게 교차 전환된다.
 */
export function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme()
  const { t } = useTranslation()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={t('theme.toggle')}
      title={isDark ? t('theme.light') : t('theme.dark')}
      className="relative"
    >
      <Sun
        className={`size-[1.15rem] transition-all duration-300 ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute size-[1.15rem] transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </Button>
  )
}
