import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

interface MarkdownViewerProps {
  content: string
  className?: string
}

/**
 * GFM + 코드 하이라이트 + raw HTML을 지원하는 README 렌더러.
 * .prose-github 클래스로 GitHub 스타일 및 코드 블록 대비 문제(버그 수정 #2)를 해결한다.
 */
export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={cn('prose prose-github', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          // 모든 링크는 새 탭 + 보안 속성
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
