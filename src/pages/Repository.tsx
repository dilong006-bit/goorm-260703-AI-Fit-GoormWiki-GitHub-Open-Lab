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
import { Loading } from '@/components/common/Loading'
import { ErrorState, EmptyState } from '@/components/common/ErrorState'
import {
  fetchReadme,
  fetchRepository,
} from '@/services/github/repository'
import { getLanguageColor } from '@/constants/languages'
import { formatCount, formatDate } from '@/utils/formatDate'
import type { ReadmeContent, Repository as Repo } from '@/types/repository'

export function Repository() {
  const { name = '' } = useParams()
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
        setError(err instanceof Error ? err.message : '불러오지 못했습니다.')
        setLoading(false)
        setReadmeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [name])

  if (loading) return <Loading label="저장소를 불러오는 중…" />
  if (error) return <ErrorState message={error} />
  if (!repo) return <ErrorState message="저장소를 찾을 수 없습니다." />

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 홈으로
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
                {repo.topics.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 text-sm font-medium">
              <Github className="size-4" />
              README
            </div>
            <div className="overflow-x-auto p-6">
              {readmeLoading ? (
                <Loading label="README 렌더링 중…" className="py-10" />
              ) : readme ? (
                <MarkdownViewer content={readme.markdown} />
              ) : (
                <EmptyState message="이 저장소에는 README가 없습니다." />
              )}
            </div>
          </div>
        </div>

        {/* 사이드바: 메타 + 링크 */}
        <aside className="space-y-6 lg:order-2">
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => window.open(repo.htmlUrl, '_blank', 'noopener')}
            >
              <Github className="size-4" /> GitHub에서 보기
            </Button>
            {repo.homepage && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(repo.homepage!, '_blank', 'noopener')
                }
              >
                <Globe className="size-4" /> Demo 열기
                <ExternalLink className="size-3.5" />
              </Button>
            )}
          </div>

          <dl className="space-y-3 rounded-lg border p-4 text-sm">
            {repo.language && (
              <Meta
                icon={
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                }
                label="언어"
                value={repo.language}
              />
            )}
            <Meta
              icon={<Star className="size-4 text-muted-foreground" />}
              label="Stars"
              value={formatCount(repo.stars)}
            />
            <Meta
              icon={<GitFork className="size-4 text-muted-foreground" />}
              label="Forks"
              value={formatCount(repo.forks)}
            />
            <Meta
              icon={<Eye className="size-4 text-muted-foreground" />}
              label="Watchers"
              value={formatCount(repo.watchers)}
            />
            {repo.license && (
              <Meta
                icon={<Scale className="size-4 text-muted-foreground" />}
                label="라이선스"
                value={repo.license}
              />
            )}
            <Meta
              icon={<Calendar className="size-4 text-muted-foreground" />}
              label="업데이트"
              value={formatDate(repo.pushedAt)}
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
