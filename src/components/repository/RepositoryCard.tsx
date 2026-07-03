import { Link } from 'react-router-dom'
import { ExternalLink, GitFork, Star } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLanguageColor } from '@/constants/languages'
import { formatCount, formatRelative } from '@/utils/formatDate'
import { useTranslation } from '@/i18n/useTranslation'
import type { Repository } from '@/types/repository'

export function RepositoryCard({ repo }: { repo: Repository }) {
  const { t, intlLocale } = useTranslation()

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link
              to={`/repository/${repo.name}`}
              className="text-primary after:absolute after:inset-0 hover:underline"
            >
              {repo.name}
            </Link>
          </CardTitle>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${repo.name} · GitHub`}
            className="relative z-10 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
          {repo.description || t('common.noDescription')}
        </p>

        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="secondary" className="font-normal">
                {topic}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="size-3.5" />
            {formatCount(repo.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="size-3.5" />
            {formatCount(repo.forks)}
          </span>
          <span className="ml-auto">
            {formatRelative(repo.pushedAt, intlLocale)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
