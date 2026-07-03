/** ISO 날짜 → "2024년 3월 15일" 형식. */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** ISO 날짜 → "3일 전" 상대 표기. */
export function formatRelative(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const sec = Math.floor(diffMs / 1000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)
  const month = Math.floor(day / 30)
  const year = Math.floor(day / 365)

  if (year > 0) return `${year}년 전`
  if (month > 0) return `${month}개월 전`
  if (day > 0) return `${day}일 전`
  if (hour > 0) return `${hour}시간 전`
  if (min > 0) return `${min}분 전`
  return '방금 전'
}

/** 큰 숫자 축약: 1200 → 1.2k */
export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}
