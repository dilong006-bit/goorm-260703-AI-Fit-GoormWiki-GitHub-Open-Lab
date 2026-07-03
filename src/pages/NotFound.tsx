import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { useTranslation } from '@/i18n/useTranslation'

export function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-gradient">404</p>
      <p className="text-muted-foreground">{t('notFound.message')}</p>
      <Link to="/" className={buttonVariants()}>
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}
