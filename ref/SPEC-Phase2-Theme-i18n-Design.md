# AI-Fit GoormWiki — Phase 2 명세서 (Theme · i18n · Design Refresh)

Phase 1 MVP를 기반으로 **다크 테마 전환**, **다국어(한/영) 지원**, **최신 디자인 트렌드** 반영을 추가한다.

- **배포:** https://goorm-260703-ai-fit-goormwiki.vercel.app
- **Repository:** https://github.com/dilong006-bit/goorm-260703-AI-Fit-GoormWiki-GitHub-Open-Lab

---

## 1. 다크 테마 전환

### 요구사항
- 라이트 / 다크 두 테마 지원, 헤더의 토글로 즉시 전환
- 3-state 정책: `light` · `dark` · `system`(OS 설정 따름, 기본값)
- 선택은 `localStorage(nextwiki:theme)`에 저장 → 재방문 시 유지
- **FOUC(첫 페인트 깜빡임) 방지:** `index.html`의 인라인 스크립트가 React 로드 전에 `<html>`에 `.dark` 클래스를 선반영
- `system` 선택 시 `prefers-color-scheme` 변화에 실시간 반응(matchMedia 리스너)

### 구현
| 파일 | 역할 |
|------|------|
| `index.html` | `<head>` 인라인 스크립트 — 저장값/OS 기준 `.dark` 프리셋, `<meta name="color-scheme">` |
| `src/store/themeStore.ts` | Zustand 스토어 — `theme`, `resolvedTheme`, `setTheme`, `applyTheme` |
| `src/hooks/useTheme.ts` | 스토어 초기화 + matchMedia 구독 훅 |
| `src/components/common/ThemeToggle.tsx` | 해·달·모니터 아이콘 순환 토글 버튼 |
| `src/index.css` | `.dark` CSS 변수 세트, `.prose-github` 다크 대응, hljs 다크 토큰 |

- Tailwind는 이미 `darkMode: ['class']`로 설정됨 → 모든 색상은 `hsl(var(--token))` 참조라 변수만 교체하면 전 컴포넌트 자동 대응

---

## 2. 다국어(i18n) 지원

### 요구사항
- 한국어(`ko`) · 영어(`en`) 지원, 헤더의 스위처로 전환
- 기본 언어: `localStorage(nextwiki:lang)` → 없으면 `navigator.language` 기준(ko 계열이면 ko, 그 외 en)
- 모든 화면 문자열을 사전(dictionary)으로 분리, 하드코딩 제거
- `<html lang>` 속성 동기화, 날짜 포맷을 로케일(`ko-KR`/`en-US`)에 연동
- 경량 자체 구현(외부 i18n 라이브러리 미도입) — 타입 안전한 키

### 구현
| 파일 | 역할 |
|------|------|
| `src/i18n/locales/ko.ts`, `en.ts` | 번역 사전(중첩 네임스페이스: common/nav/home/search/category/repo/about/theme) |
| `src/i18n/types.ts` | 사전 키 타입, `Locale` 유니온 |
| `src/i18n/I18nProvider.tsx` | Context Provider + `localStorage` 저장 + `<html lang>` 동기화 |
| `src/i18n/useTranslation.ts` | `t(key, vars?)` 함수, 보간(`{{var}}`) 지원, `locale`, `setLocale` |
| `src/components/common/LanguageSwitcher.tsx` | KO/EN 세그먼트 스위처 |
| `src/utils/formatDate.ts` | `formatDate`, `formatRelative`, `formatCount`에 `locale` 인자 |

### 번역 키 커버리지
네비게이션, 홈(히어로/섹션/카테고리 라벨/설명), 검색(제목/필터/정렬/빈 상태), 카테고리, 저장소 상세(메타 라벨/버튼), 소개, 로딩/에러/빈 상태, 테마/언어 라벨.

---

## 3. 최신 디자인 트렌드

### 방향성
모던·미니멀·고대비. GitHub/Linear/Vercel 계열의 절제된 세련미.

- **타이포그래피:** Pretendard Variable(CDN) — 한/영 모두 정갈한 가변 폰트. 폴백 시스템 폰트 유지
- **컬러:** 브랜드 액센트를 인디고/바이올렛 계열로 리프레시(라이트·다크 각각 톤 정의). 시맨틱 토큰(`primary`, `accent`, `muted`, `border`, `ring`) 재정의
- **표면:** `radius` 상향(0.75rem), 카드 hover 시 border 강조 + 부드러운 그림자, 유리질감(backdrop-blur) 헤더
- **히어로:** 은은한 방사형/그라디언트 배경, 배지형 서브타이틀
- **마이크로 인터랙션:** 트랜지션(색·그림자·transform), 포커스 링 일관화, 스켈레톤 shimmer
- **접근성:** 라이트·다크 모두 WCAG AA 대비 목표, `:focus-visible` 링, `aria-label` 유지

### 영향 파일
`index.css`(토큰·유틸), `tailwind.config.js`(필요 시 확장), `Header`·`Footer`·`AppLayout`, `Home`(히어로/섹션), `RepositoryCard`, `common/*`(Loading/ErrorState/Filter/Pagination), `ui/*`.

---

## 4. 신규/변경 디렉토리 구조(추가분)

```
src/
├── i18n/
│   ├── locales/ ko.ts, en.ts
│   ├── types.ts
│   ├── I18nProvider.tsx
│   └── useTranslation.ts
├── store/          + themeStore.ts
├── hooks/          + useTheme.ts
└── components/common/ + ThemeToggle.tsx, LanguageSwitcher.tsx
```

## 5. 완료 기준(Acceptance)

- [ ] 헤더 토글로 라이트↔다크 즉시 전환, 새로고침 후 유지, FOUC 없음
- [ ] `system` 모드에서 OS 테마 변경이 실시간 반영
- [ ] 헤더 스위처로 한↔영 전환, 모든 화면 문자열·날짜가 언어에 맞게 변경, 재방문 시 유지
- [ ] 다크 모드에서 README(prose)·코드 하이라이트 가독성 정상
- [ ] `tsc -b` 무오류, `npm run build` 성공, 로컬/프로덕션 구동 정상
- [ ] 반응형·기존 기능(검색/필터/상세/캐싱) 회귀 없음

## 6. 비고
- 기존 버그 수정 이력(#1 검색 강제 리다이렉트, #2 코드블록 대비)의 해법은 그대로 유지한다.
- 외부 폰트/CDN은 실제 배포 앱에서만 사용(정적 자산 CSP 제약 없음).
