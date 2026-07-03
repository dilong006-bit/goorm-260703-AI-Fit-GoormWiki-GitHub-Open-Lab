# AI-Fit GoormWiki · GitHub Open Lab

**한국어** | [English](README.en.md)

GitHub Repository를 **학습자 친화적인 Wiki**로 탐색하고, **여러 LLM으로 학습 콘텐츠를 생성**하는 React 웹앱입니다.

- 🌐 **라이브 데모:** https://goorm-260703-ai-fit-goormwiki.vercel.app
- 📦 **저장소:** https://github.com/dilong006-bit/goorm-260703-AI-Fit-GoormWiki-GitHub-Open-Lab
- 👤 **기본 조회 계정:** [@dilong006-bit](https://github.com/dilong006-bit)

---

## 주요 기능

### Phase 1 — 코어
- GitHub Repository 자동 조회 (페이지네이션, 200개 이상 지원)
- 프로젝트 검색 (이름·설명·언어·토픽)
- 카테고리 / 언어 필터 (React, Vue, Python, Node, AI 등)
- README Markdown 렌더링 (GFM, 코드 하이라이트, 이미지 경로 변환)
- GitHub / Demo 링크 이동
- 반응형 UI (모바일 1열 · 태블릿 2열 · 데스크톱 4열)
- localStorage 24시간 캐싱
- `RepositoryMeta` 확장 인터페이스 준비

### Phase 2 — 테마 · 다국어 · 디자인
- 🌗 **다크 테마 전환** — 라이트/다크 토글 + `system`(OS) 감지, localStorage 저장, FOUC 방지 인라인 스크립트, OS 테마 변경 실시간 반응
- 🌐 **다국어(i18n)** — 한국어/영어 전환, 전체 UI 문자열 사전화, 날짜 로케일(`Intl`) 연동, `<html lang>` 동기화, 재방문 시 유지
- ✨ **디자인 리프레시** — 인디고 액센트 토큰(라이트/다크), Pretendard 가변 폰트, 히어로 그라디언트, 카드 마이크로 인터랙션, prose·코드 하이라이트 다크 대응

> 명세: [ref/SPEC-Phase2-Theme-i18n-Design.md](ref/SPEC-Phase2-Theme-i18n-Design.md)

### Phase 3 — Multi-LLM 콘텐츠 스튜디오
- 🤖 **AI 콘텐츠 스튜디오** — 저장소 상세에서 README를 입력으로 학습 콘텐츠 생성: 3줄 브리핑 · 학습 로드맵 · 실습 퀴즈 · README 번역 · 저장소 Q&A · 최신 동향
- 🔀 **멀티 LLM 게이트웨이** — OpenAI · Claude · Gemini · Perplexity를 `generate()` / `stream()` 단일 인터페이스로 (참고: [multi-llm-sdk](https://github.com/junsang-dong/goorm-260630-multi-llm-sdk))
- 🧪 **키 없이 즉시 동작** — API 키가 없으면 `mock`(시뮬레이션 스트리밍)으로 폴백, 키를 넣으면 실제 LLM 연결
- ⚡ **스트리밍 · 24h 캐싱 · 로케일 연동** — 실시간 토큰 출력, 결과 캐시로 비용 절감, 현재 UI 언어로 생성

> 명세: [ref/SPEC-Phase3-Multi-LLM-Content-Studio.md](ref/SPEC-Phase3-Multi-LLM-Content-Studio.md)

---

## 아키텍처

```
GitHub API ─→ Axios(api.ts) ─→ Repository Service ─→ Zustand Store ─→ React Pages
                                      │                                    │
                                localStorage Cache (24h)                   │
                                                                           ▼
                              README ─→ AI 콘텐츠 서비스 ─→ Multi-LLM 게이트웨이
                                        (prompts/cache)     generate() / stream()
                                                                           │
                                        ┌──────────────┬──────────┬────────┴─────────┐
                                     OpenAI         Claude      Gemini   Perplexity / mock
```

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 검색, 카테고리, 인기/최근 프로젝트, 전체 목록 |
| `/search` | 검색 — 키워드·필터·URL query (`?q=`) 지원 |
| `/category/:name` | 카테고리별 프로젝트 탐색 |
| `/repository/:name` | 프로젝트 상세 + README + **AI 콘텐츠 스튜디오** |
| `/about` | 서비스 소개 |

## 기술 스택

- **프론트엔드:** React 19 · Vite · TypeScript · TailwindCSS · Shadcn UI · React Router · Zustand · Axios
- **콘텐츠:** react-markdown · rehype-highlight · remark-gfm · Lucide React · Pretendard
- **AI:** Multi-LLM 게이트웨이 (OpenAI · Claude · Gemini · Perplexity · mock)

---

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
| `VITE_GITHUB_USERNAME` | 조회할 GitHub 사용자명 | `dilong006-bit` |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (선택, Rate Limit 완화) | - |
| `VITE_OPENAI_KEY` | OpenAI API 키 (선택) | - |
| `VITE_CLAUDE_KEY` | Anthropic Claude API 키 (선택) | - |
| `VITE_GEMINI_KEY` | Google Gemini API 키 (선택) | - |
| `VITE_PERPLEXITY_KEY` | Perplexity API 키 (선택) | - |

- **GitHub Token:** [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)에서 Fine-grained token(Public repos Read-only) 발급. 없어도 동작하지만 Rate Limit(시간당 60회)에 걸릴 수 있으며, 설정 시 시간당 5,000회로 완화됩니다.
- **LLM 키:** 모두 선택 사항입니다. **하나도 없으면 자동으로 `mock`(시뮬레이션)으로 동작**하고, 키를 넣으면 해당 프로바이더가 스튜디오에 등장합니다.
- ⚠️ **보안:** `VITE_` 접두사 키는 브라우저 번들에 노출됩니다. 공개 배포 시에는 서버리스 프록시 사용을 권장합니다 ([Phase 3 명세 §7](ref/SPEC-Phase3-Multi-LLM-Content-Studio.md)).

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/       Header, Footer, AppLayout
│   ├── common/       SearchBox, Filter, Loading, Pagination, ErrorState,
│   │                 ThemeToggle, LanguageSwitcher
│   ├── repository/   RepositoryCard, RepositoryGrid, MarkdownViewer,
│   │                 AIStudioPanel, ProviderPicker
│   └── ui/           Button, Card, Badge, Input, Textarea
├── pages/            Home, Search, Category, Repository, About, NotFound
├── i18n/             locales/(ko, en), I18nProvider, useTranslation, context, types
├── llm/              gateway, providers(openai·claude·gemini·perplexity·mock), config, types
├── services/
│   ├── github/       api.ts, repository.ts, cache.ts
│   └── ai/           prompts.ts, providerProfiles.ts, contentService.ts
├── store/            repositoryStore.ts, themeStore.ts (Zustand)
├── hooks/            useRepositories, useSearch, useDebounce, useTheme, useAIContent
├── types/            repository.ts (RepositoryMeta 포함)
├── utils/            filterRepos, formatDate, readmeImages
├── constants/        categories, languages
├── config/           env.ts
└── lib/              utils.ts (cn)
```

## 버그 수정 이력

### 1. 페이지 이동 시 `/search`로 강제 리다이렉트
- **원인:** Header에 항상 마운트된 `SearchBox`가 마운트 시 빈 검색어로 `onSearch('')`를 호출 → 핸들러가 빈 값에도 `navigate('/search')` 실행
- **수정:** `SearchBox`는 `userTypedRef`로 사용자가 직접 입력한 경우에만 debounce 검색 실행. `Header`/`Home`은 검색어가 있을 때만 `/search?q=...`로 이동

### 2. README 코드·아키텍처 블록 텍스트 가독성
- **원인:** Tailwind Typography(`prose`)의 `pre code` 텍스트가 밝은 회색인데 배경(`#f6f8fa`)과 대비가 사라짐
- **수정:** `.prose-github`에 다크 그레이(`#1f2328`) 텍스트 및 Typography CSS 변수 오버라이드 적용 (다크 모드는 GitHub 다크 팔레트 대응)

## Vercel 배포

1. 이 저장소를 GitHub에 push
2. [vercel.com](https://vercel.com) → **Add New → Project** → 저장소 Import (Framework Preset: **Vite** 자동 감지)
3. **Settings → Environment Variables**에 `VITE_GITHUB_USERNAME`, `VITE_GITHUB_TOKEN`(선택) 추가 (Production/Preview/Development)
4. **Deploy** — `vercel.json`의 SPA fallback rewrite로 React Router 경로가 정상 동작

## 개발 로드맵

- ✅ **Phase 1** — 코어 위키 (조회·검색·필터·README)
- ✅ **Phase 2** — 다크 테마 · 다국어(한/영) · 디자인 리프레시
- ✅ **Phase 3-A** — Multi-LLM 콘텐츠 스튜디오 MVP (mock 폴백)
- ⬜ **Phase 3-B** — 비교 모드(멀티 LLM 병렬) · 최신 동향(Perplexity) · 공유
- ⬜ **Phase 3-C** — 서버리스 프록시(키 보안) · 앙상블/심판 · `RepositoryMeta` 자동 태깅

## 라이선스

Private — AI-Fit GoormWiki Open Lab
