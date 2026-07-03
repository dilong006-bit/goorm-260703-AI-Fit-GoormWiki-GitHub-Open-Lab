import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Eye,
  GitFork,
  Github,
  Globe,
  Scale,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarkdownViewer } from '@/components/repository/MarkdownViewer'
import { AIStudioPanel } from '@/components/repository/AIStudioPanel'
import { Loading } from '@/components/common/Loading'
import { ErrorState, EmptyState } from '@/components/common/ErrorState'
import { fetchReadme, fetchRepository } from '@/services/github/repository'
import { getLanguageColor } from '@/constants/languages'
import { formatCount, formatDate } from '@/utils/formatDate'
import { useTranslation } from '@/i18n/useTranslation'
import type { ReadmeContent, Repository as Repo } from '@/types/repository'

export function Repository() {
  const { name = '' } = useParams()
  const { t, intlLocale } = useTranslation()
  const [repo, setRepo] = useState<Repo | null>(null)
  const [readme, setReadme] = useState<ReadmeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [readmeLoading, setReadmeLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setReadmeLoading(true)
    setError(null)
    setReadme(null)

    fetchRepository(name)
      .then((r) => {
        if (cancelled) return
        setRepo(r)
        setLoading(false)
        // README는 저장소 로드 이후 이어서 조회
        return fetchReadme(r).then((content) => {
          if (cancelled) return
          setReadme(content)
          setReadmeLoading(false)
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : t('repo.notFound'))
        setLoading(false)
        setReadmeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [name, t])

  if (loading) return <Loading label={t('repo.loading')} />
  if (error) return <ErrorState message={error} />
  if (!repo) return <ErrorState message={t('repo.notFound')} />

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t('repo.back')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* 본문: README */}
        <div className="min-w-0 space-y-6 lg:order-1">
          <div className="space-y-3">
            <h1 className="break-words text-2xl font-bold sm:text-3xl">
              {repo.name}
            </h1>
            {repo.description && (
              <p className="text-muted-foreground">{repo.description}</p>
            )}
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((tp) => (
                  <Badge key={tp} variant="secondary" className="font-normal">
                    {tp}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-sm font-medium">
              <Github className="size-4" />
              {t('repo.readme')}
            </div>
            <div className="overflow-x-auto p-6">
              {readmeLoading ? (
                <Loading label={t('repo.readmeLoading')} className="py-10" />
              ) : readme ? (
                <MarkdownViewer content={readme.markdown} />
              ) : (
                <EmptyState message={t('repo.noReadme')} />
              )}
            </div>
          </div>

          <AIStudioPanel repo={repo} readme={readme?.markdown ?? null} />
        </div>

        {/* 사이드바: 메타 + 링크 */}
        <aside className="space-y-6 lg:order-2">
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => window.open(repo.htmlUrl, '_blank', 'noopener')}
            >
              <Github className="size-4" /> {t('repo.viewOnGithub')}
            </Button>
            {repo.homepage && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(repo.homepage!, '_blank', 'noopener')
                }
              >
                <Globe className="size-4" /> {t('repo.openDemo')}
                <ExternalLink className="size-3.5" />
              </Button>
            )}
          </div>

          <dl className="space-y-3 rounded-xl border p-4 text-sm">
            {repo.language && (
              <Meta
                icon={
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                }
                label={t('repo.meta.language')}
                value={repo.language}
              />
            )}
            <Meta
              icon={<Star className="size-4 text-muted-foreground" />}
              label={t('repo.meta.stars')}
              value={formatCount(repo.stars)}
            />
            <Meta
              icon={<GitFork className="size-4 text-muted-foreground" />}
              label={t('repo.meta.forks')}
              value={formatCount(repo.forks)}
            />
            <Meta
              icon={<Eye className="size-4 text-muted-foreground" />}
              label={t('repo.meta.watchers')}
              value={formatCount(repo.watchers)}
            />
            {repo.license && (
              <Meta
                icon={<Scale className="size-4 text-muted-foreground" />}
                label={t('repo.meta.license')}
                value={repo.license}
              />
            )}
            <Meta
              icon={<Calendar className="size-4 text-muted-foreground" />}
              label={t('repo.meta.updated')}
              value={formatDate(repo.pushedAt, intlLocale)}
            />
          </dl>
        </aside>
      </div>
    </div>
  )
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
