import { Github, Layers, Search, Zap, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { env } from '@/config/env'
import { useTranslation } from '@/i18n/useTranslation'
import type { TranslationKey } from '@/i18n/types'

const FEATURES: {
  icon: LucideIcon
  title: TranslationKey
  desc: TranslationKey
}[] = [
  {
    icon: Search,
    title: 'about.feature.search.title',
    desc: 'about.feature.search.desc',
  },
  {
    icon: Layers,
    title: 'about.feature.readme.title',
    desc: 'about.feature.readme.desc',
  },
  {
    icon: Zap,
    title: 'about.feature.cache.title',
    desc: 'about.feature.cache.desc',
  },
]

const STACK = [
  'React 19',
  'Vite',
  'TypeScript',
  'TailwindCSS',
  'Shadcn UI',
  'React Router',
  'Zustand',
  'Axios',
  'react-markdown',
  'Lucide React',
]

export function About() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold">{t('about.title')}</h1>
        <p className="text-muted-foreground">{t('about.subtitle')}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <Card
              key={f.title}
              className="space-y-2 p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{t(f.title)}</h3>
              <p className="text-sm text-muted-foreground">{t(f.desc)}</p>
            </Card>
          )
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('about.stackTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border bg-muted/40 px-3 py-1 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('about.sourceTitle')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('about.sourceText', { user: `@${env.githubUsername}` })}
        </p>
        <a
          href={`https://github.com/${env.githubUsername}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Github className="size-4" />@{env.githubUsername}
        </a>
      </section>
    </div>
  )
}
