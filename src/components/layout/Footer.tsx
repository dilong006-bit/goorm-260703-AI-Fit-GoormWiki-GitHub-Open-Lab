import { Github } from 'lucide-react'
import { env } from '@/config/env'
import { useTranslation } from '@/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/60 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {t('brand.name')} · GitHub Open Lab
        </p>
        <a
          href={`https://github.com/${env.githubUsername}`}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Github className="size-4" />@{env.githubUsername}
        </a>
      </div>
    </footer>
  )
}
