# AI-Fit GoormWiki GitHub Open Lab

GitHub Repository를 학습자 친화적인 Wiki 형태로 탐색하는 React 기반 웹앱 (Phase 1 MVP)

**Repository:** [github.com/dilong006/nextwiki](https://github.com/dilong006/nextwiki)

---

## 주요 구현 내용

### Phase 1 MVP 기능

- GitHub Repository 자동 조회 (페이지네이션, 200개 이상 지원)
- 프로젝트 검색 (이름, 설명, 언어, 토픽)
- 카테고리/언어 필터 (React, Vue, Python, Node, AI 등)
- README Markdown 렌더링 (GFM, 코드 하이라이트, 이미지 경로 변환)
- GitHub / Demo 링크 이동
- 반응형 UI (모바일 1열 · 태블릿 2열 · 데스크톱 4열)
- localStorage 24시간 캐싱
- Phase 2 확장용 `RepositoryMeta` 인터페이스 준비

### 아키텍처

```
GitHub API → Axios (api.ts) → Repository Service → Zustand Store → React Pages
                    ↓
              localStorage Cache (24h)
```

### 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 검색, 카테고리, 최근/인기 프로젝트, 전체 목록 |
| `/search` | 검색 — 키워드·필터·URL query (`?q=`) 지원 |
| `/category/:name` | 카테고리별 프로젝트 탐색 |
| `/repository/:name` | 프로젝트 상세 + README |
| `/about` | 서비스 소개 |

---

## 버그 수정 이력

### 1. 페이지 이동 시 `/search`로 강제 리다이렉트

**증상:** 홈 또는 리포지토리 상세 페이지로 이동해도 약 300ms 후 `/search`로 되돌아감

**원인:** Header에 항상 마운트된 `SearchBox`가 마운트·리렌더 시 빈 검색어로 `onSearch('')`를 호출하고, 핸들러가 빈 값일 때도 `navigate('/search')`를 실행함

**수정:**
- `SearchBox` — 사용자가 직접 입력한 경우에만 debounce 검색 실행
- `Header` / `Home` — 검색어가 있을 때만 `/search?q=...`로 이동

### 2. README 코드·아키텍처 블록 텍스트 가독성

**증상:** 리포지토리 상세 페이지에서 `pre`/`code` 블록(프로젝트 구조, 아키텍처 다이어그램 등)의 텍스트가 배경과 구분되지 않음

**원인:** Tailwind Typography(`prose`)가 `pre code` 텍스트를 밝은 회색(`gray-200`)으로 설정하는데, 배경은 밝은 `#f6f8fa`로 오버라이드되어 대비가 사라짐

**수정:** `.prose-github`에 다크 그레이(`#1f2328`) 텍스트 색상 및 Typography CSS 변수 오버라이드 적용

---

## 기술 스택

React 19 · Vite · TypeScript · TailwindCSS · Shadcn UI · React Router · Zustand · Axios · react-markdown · rehype-highlight · remark-gfm · Lucide React

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_GITHUB_USERNAME` | 조회할 GitHub 사용자명 | `junsang-dong` |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (선택, Rate Limit 완화) | - |

### GitHub Token 발급

1. [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Fine-grained token 생성 (Public repos Read-only 권한)
3. `.env`에 `VITE_GITHUB_TOKEN=github_pat_...` 추가 후 개발 서버 재시작

Token 없이도 동작하지만, Rate Limit(시간당 60회)에 걸릴 수 있습니다.

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/       Header, Footer, AppLayout
│   ├── common/       SearchBox, Filter, Loading, Pagination, ErrorState
│   ├── repository/   RepositoryCard, MarkdownViewer
│   └── ui/           Shadcn UI (Button, Card, Badge, Input, ...)
├── pages/            Home, Search, Category, Repository, About
├── services/github/  api.ts, repository.ts, cache.ts
├── store/            repositoryStore.ts (Zustand)
├── hooks/            useRepositories, useSearch
├── types/            repository.ts (RepositoryMeta 포함)
├── utils/            filterRepos, formatDate, readmeImages
├── constants/        categories, languages
└── config/           env.ts
```

## Vercel 배포

### 1. GitHub 연동

이 저장소를 [github.com/junsang-dong/nextwiki](https://github.com/junsang-dong/nextwiki)에 push합니다.

### 2. Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) 로그인
2. **Add New → Project**
3. GitHub에서 `junsang-dong/nextwiki` 저장소 Import
4. Framework Preset: **Vite** (자동 감지)

### 3. 환경 변수 설정

Vercel 대시보드 → Project → **Settings → Environment Variables**

| Name | Value |
|------|-------|
| `VITE_GITHUB_USERNAME` | `junsang-dong` |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token |

Production, Preview, Development 환경 모두에 추가하는 것을 권장합니다.

### 4. Deploy

**Deploy** 버튼 클릭. `vercel.json`에 SPA fallback rewrite가 설정되어 있어 React Router 경로가 정상 동작합니다.

### 5. 배포 후 확인

- [ ] 홈에서 저장소 목록 로드
- [ ] 검색·카테고리 필터 동작
- [ ] 리포지토리 상세 README 렌더링
- [ ] 모바일 반응형 레이아웃

---

## 라이선스

Private — NextWiki Open Lab Phase 1 MVP
