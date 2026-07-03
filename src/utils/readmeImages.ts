/**
 * README 내 상대경로 이미지/링크를 GitHub raw·blob 절대경로로 변환한다.
 * react-markdown 렌더 전에 원본 마크다운 문자열을 전처리.
 *
 * @param markdown  원본 README 마크다운
 * @param owner     저장소 소유자
 * @param repo      저장소 이름
 * @param branch    기본 브랜치
 */
export function resolveReadmeAssets(
  markdown: string,
  owner: string,
  repo: string,
  branch: string,
): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}`

  let out = markdown

  // 마크다운 이미지: ![alt](relative/path)
  out = out.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt: string, url: string) => {
      if (isAbsolute(url) || url.startsWith('#')) return match
      return `![${alt}](${joinUrl(rawBase, url)})`
    },
  )

  // HTML <img src="relative/path">
  out = out.replace(
    /<img([^>]*?)src=["']([^"']+)["']/gi,
    (match, pre: string, url: string) => {
      if (isAbsolute(url)) return match
      return `<img${pre}src="${joinUrl(rawBase, url)}"`
    },
  )

  // 마크다운 링크: [text](relative/path) — 이미지 구문(!)은 위에서 처리됨
  out = out.replace(
    /(^|[^!])\[([^\]]+)\]\(([^)]+)\)/g,
    (match, prefix: string, text: string, url: string) => {
      if (isAbsolute(url) || url.startsWith('#')) return match
      return `${prefix}[${text}](${joinUrl(blobBase, url)})`
    },
  )

  return out
}

function isAbsolute(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('mailto:')
}

function joinUrl(base: string, path: string): string {
  const clean = path.replace(/^\.\//, '').replace(/^\//, '')
  return `${base}/${clean}`
}
