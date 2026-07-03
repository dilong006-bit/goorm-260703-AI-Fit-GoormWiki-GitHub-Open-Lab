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
import type { Repository } from '@/types/repository'

export function RepositoryCard({ repo }: { repo: Repository }) {
  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link
              to={`/repository/${repo.name}`}
              className="text-primary hover:underline"
            >
              {repo.name}
            </Link>
          </CardTitle>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${repo.name} GitHub에서 열기`}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
          {repo.description || '설명이 없습니다.'}
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
          <span className="ml-auto">{formatRelative(repo.pushedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
