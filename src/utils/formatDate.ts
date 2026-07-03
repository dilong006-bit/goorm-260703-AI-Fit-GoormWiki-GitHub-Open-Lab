/** ISO 날짜 → 로케일별 긴 날짜 형식. */
export function formatDate(iso: string, locale = 'ko-KR'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** ISO 날짜 → 로케일별 상대 표기 (Intl.RelativeTimeFormat). */
export function formatRelative(iso: string, locale = 'ko-KR'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSec)

  const min = 60
  const hour = min * 60
  const day = hour * 24
  const month = day * 30
  const year = day * 365

  if (abs >= year) return rtf.format(Math.round(diffSec / year), 'year')
  if (abs >= month) return rtf.format(Math.round(diffSec / month), 'month')
  if (abs >= day) return rtf.format(Math.round(diffSec / day), 'day')
  if (abs >= hour) return rtf.format(Math.round(diffSec / hour), 'hour')
  if (abs >= min) return rtf.format(Math.round(diffSec / min), 'minute')
  return rtf.format(diffSec, 'second')
}

/** 큰 숫자 축약: 1200 → 1.2k */
export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}
