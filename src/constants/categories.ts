import type { LucideIcon } from 'lucide-react'
import {
  Atom,
  Braces,
  Brain,
  Layers,
  Server,
  Smartphone,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'

export interface Category {
  /** URL slug (/category/:name) */
  slug: string
  label: string
  description: string
  icon: LucideIcon
  /** 이 카테고리로 분류되는 언어/토픽 키워드 (소문자) */
  keywords: string[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'react',
    label: 'React',
    description: 'React·Next.js 기반 프론트엔드 프로젝트',
    icon: Atom,
    keywords: ['react', 'next', 'nextjs', 'jsx', 'tsx'],
  },
  {
    slug: 'vue',
    label: 'Vue',
    description: 'Vue·Nuxt 기반 프로젝트',
    icon: Layers,
    keywords: ['vue', 'nuxt', 'vuejs'],
  },
  {
    slug: 'python',
    label: 'Python',
    description: 'Python 스크립트·데이터·백엔드',
    icon: TerminalSquare,
    keywords: ['python', 'django', 'flask', 'fastapi', 'jupyter notebook'],
  },
  {
    slug: 'node',
    label: 'Node',
    description: 'Node.js·Express 서버 프로젝트',
    icon: Server,
    keywords: ['node', 'nodejs', 'express', 'nestjs', 'javascript'],
  },
  {
    slug: 'ai',
    label: 'AI',
    description: 'AI·머신러닝·LLM 프로젝트',
    icon: Brain,
    keywords: ['ai', 'ml', 'machine-learning', 'llm', 'openai', 'tensorflow', 'pytorch'],
  },
  {
    slug: 'typescript',
    label: 'TypeScript',
    description: 'TypeScript 기반 프로젝트',
    icon: Braces,
    keywords: ['typescript', 'ts'],
  },
  {
    slug: 'mobile',
    label: 'Mobile',
    description: 'Flutter·React Native·모바일 앱',
    icon: Smartphone,
    keywords: ['flutter', 'dart', 'react-native', 'kotlin', 'swift', 'android', 'ios'],
  },
  {
    slug: 'etc',
    label: 'ETC',
    description: '기타 프로젝트',
    icon: Sparkles,
    keywords: [],
  },
]

export const getCategoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug)
