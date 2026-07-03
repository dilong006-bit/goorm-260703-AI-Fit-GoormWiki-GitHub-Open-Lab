import { Github, Layers, Search, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { env } from '@/config/env'

const FEATURES = [
  {
    icon: Search,
    title: '스마트 검색 & 필터',
    desc: '이름·설명·언어·토픽으로 프로젝트를 빠르게 찾고 카테고리별로 탐색합니다.',
  },
  {
    icon: Layers,
    title: 'README Wiki 뷰',
    desc: 'GFM 마크다운, 코드 하이라이트, 이미지 경로 변환을 지원하는 문서 렌더링.',
  },
  {
    icon: Zap,
    title: '24시간 캐싱',
    desc: 'localStorage 캐시로 GitHub API 요청을 최소화하고 빠르게 로드합니다.',
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
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold">AI-Fit GoormWiki 소개</h1>
        <p className="text-muted-foreground">
          GitHub Repository를 학습자 친화적인 Wiki 형태로 탐색하는 오픈 랩
          프로젝트입니다. (Phase 1 MVP)
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon
          return (
            <Card key={f.title} className="space-y-2 p-5">
              <Icon className="size-6 text-primary" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          )
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">기술 스택</h2>
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
        <h2 className="text-xl font-semibold">데이터 출처</h2>
        <p className="text-sm text-muted-foreground">
          모든 프로젝트 정보는 GitHub REST API를 통해{' '}
          <a
            href={`https://github.com/${env.githubUsername}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <Github className="size-4" />@{env.githubUsername}
          </a>
          {' '}계정에서 실시간으로 가져옵니다.
        </p>
      </section>
    </div>
  )
}
