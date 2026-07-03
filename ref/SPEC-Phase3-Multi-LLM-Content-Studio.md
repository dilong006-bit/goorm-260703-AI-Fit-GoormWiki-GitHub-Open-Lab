# AI-Fit GoormWiki — Phase 3 명세서 (Multi-LLM 응용 콘텐츠 스튜디오)

Phase 1(코어)·Phase 2(테마·i18n·디자인)를 기반으로, **여러 LLM으로 저장소 학습 콘텐츠를 생성**하는
"AI 콘텐츠 스튜디오"를 추가한다.

- **참고 SDK:** [junsang-dong/goorm-260630-multi-llm-sdk](https://github.com/junsang-dong/goorm-260630-multi-llm-sdk)
  — `createLLM` / `generate` / `stream` 단일 인터페이스로 OpenAI·Claude·Gemini·Perplexity 추상화
- **배포:** https://goorm-260703-ai-fit-goormwiki.vercel.app

---

## 1. 컨셉 & 목표

> **"저장소를 읽는 위키" → "저장소로 학습 콘텐츠를 생성하는 위키"**

- README·메타데이터를 **입력**으로, 여러 LLM이 요약·퀴즈·로드맵·번역·Q&A·최신동향을 **생성**한다.
- 멀티 LLM을 "선택 가능"에서 그치지 않고 **비교·앙상블·역할분담**으로 의미 있게 활용한다.
- 기존 인프라(README fetch, 24h 캐시, i18n, RepositoryMeta)를 최대한 재사용한다.

### 비목표(Non-goals)
- 자체 모델 학습/파인튜닝, 벡터DB/RAG 인프라(Phase 4 이후 검토).
- 대화 히스토리 영속화(초기엔 세션 한정).

---

## 2. 아키텍처 개요

```
Repository 상세 페이지
      │  (fetchReadme → markdown)
      ▼
contentService.ts ── prompts.ts(콘텐츠별 systemPrompt)
      │  GenerateRequest 조립 + 캐시 확인
      ▼
llm/ (이식된 SDK: gateway · providers · config · types)
      │  generate() / stream()
      ▼
[개발] Provider API 직접 호출 (VITE_*_KEY)
[운영] /api/llm (Vercel Function 프록시, 키는 서버에만)
      ▼
OpenAI · Claude · Gemini · Perplexity
```

### 레이어 책임
| 레이어 | 책임 |
|--------|------|
| `llm/` | Provider 추상화(SDK 원본 이식, 수정 최소화) |
| `services/ai/` | 도메인 로직: README→프롬프트 조립, 캐시, 스트림 오케스트레이션 |
| `store/aiStore.ts` | 생성 상태·결과·선택 provider (Zustand) |
| `components/repository/AIStudioPanel` | UI, 콘텐츠 탭·provider 선택·스트리밍 표시 |

---

## 3. 디렉토리 구조(추가분)

```
src/
├── llm/                              # SDK 이식 (index, types, config, gateway, providers/*)
├── services/ai/
│   ├── prompts.ts                    # 콘텐츠 유형별 프롬프트 템플릿
│   ├── contentService.ts             # 생성 오케스트레이션 + 캐시
│   └── providerProfiles.ts           # 콘텐츠↔추천 provider/model 매핑
├── store/aiStore.ts                  # 생성 상태 (Zustand)
├── hooks/useAIContent.ts             # 스트리밍 구독 훅
├── components/repository/
│   ├── AIStudioPanel.tsx             # 콘텐츠 스튜디오 (탭 + 결과)
│   ├── ProviderPicker.tsx            # provider/model 선택
│   └── ProviderCompare.tsx           # 비교 모드 그리드 (Phase 3-B)
└── api/                              # (운영) Vercel Function 프록시
    └── llm.ts
```

---

## 4. 콘텐츠 유형 & 프롬프트 설계

각 유형은 `systemPrompt`(역할·형식·언어 규칙) + `userPrompt`(README 컨텍스트)로 구성한다.
**공통 규칙:** 출력 언어는 현재 UI 로케일(`ko`/`en`)을 따른다. README가 매우 길면 앞부분 N자(기본 8,000자)로 truncate.

| ID | 유형 | 출력 형식 | 추천 Provider/Model | 근거 |
|----|------|-----------|---------------------|------|
| `brief` | 3줄 브리핑 + 난이도 | 마크다운(3 bullet + 배지) | Gemini 2.5 Flash | 저지연·저비용 |
| `roadmap` | 학습 로드맵 | 번호형 단계 목록 | Claude Sonnet 4.6 | 구조적 설명 |
| `quiz` | 실습 퀴즈 3~5문항 | JSON(문항/보기/정답/해설) | GPT-5 mini | 범용 생성 |
| `translate` | README 현지화 | 마크다운(원본 구조 유지) | Gemini 2.5 Flash | 번역 속도·비용 |
| `qna` | 저장소 Q&A(대화) | 스트리밍 텍스트 | Claude Opus 4.8 | 긴 문서 정확도 |
| `trend` | 기술스택 최신 동향·대안 | 마크다운 + 출처 | **Perplexity Sonar** | 웹 grounded(실시간) |

### 프롬프트 템플릿 예시 (`prompts.ts` 스케치)
```ts
export const SYSTEM_PROMPTS = {
  brief: (lang: string) =>
    `You are a coding mentor for beginners. Summarize the given GitHub README ` +
    `in exactly 3 concise bullet points, then a difficulty rating ` +
    `(Beginner/Intermediate/Advanced) with one-line reason. Answer in ${lang}.`,
  quiz: (lang: string) =>
    `Create 3-5 multiple-choice questions to check understanding of the README. ` +
    `Return STRICT JSON: {"questions":[{"q","choices":[],"answer","explain"}]}. ` +
    `Write question text in ${lang}.`,
  // roadmap / translate / qna / trend ...
} as const

export function buildUserPrompt(readme: string, repoName: string, extra?: string) {
  const ctx = readme.slice(0, 8000)
  return `Repository: ${repoName}\n\n<README>\n${ctx}\n</README>\n\n${extra ?? ''}`
}
```

### 서비스 인터페이스 (`contentService.ts` 스케치)
```ts
export type ContentType = 'brief' | 'roadmap' | 'quiz' | 'translate' | 'qna' | 'trend'

export interface GenerateContentParams {
  repo: Repository
  readme: string
  type: ContentType
  provider: ProviderName
  model: string
  locale: 'ko' | 'en'
  question?: string          // qna용
  signal?: AbortSignal
}

// 스트리밍 콘텐츠
export async function* streamContent(p: GenerateContentParams): AsyncGenerator<string>
// 캐시 우선 1회성 콘텐츠
export async function getContent(p: GenerateContentParams): Promise<string>
```

---

## 5. 멀티 LLM 활용 패턴

| 패턴 | 설명 | 도입 단계 |
|------|------|-----------|
| **선택(Select)** | provider/model 드롭다운으로 1개 실행 | 3-A |
| **비교(Compare)** | 동일 프롬프트를 2~4 provider에 병렬 fan-out → 나란히 스트리밍 | 3-B |
| **앙상블+심판(Ensemble→Judge)** | N개 초안 → Claude가 종합해 최종 1개 | 3-C |
| **역할분담 파이프라인** | Sonar(자료수집) → GPT-5(초안) → Claude(퇴고) | 3-C |

- 비교 모드는 `Promise.all`로 각 `stream()`을 개별 상태에 바인딩(격자 카드).
- 병렬 실행은 요청 수가 배가되므로 **명시적 트리거 + 캐시 + maxTokens 상한** 필수.

---

## 6. 캐싱 · 비용 · 성능

- **캐시 키:** `ai:{repoFullName}:{type}:{provider}:{model}:{locale}` (qna 제외). 기존 [cache.ts](../src/services/github/cache.ts) 재사용, TTL 24h.
- **비용 통제:** 자동 생성 금지(버튼 트리거), `maxTokens` 상한(brief 512 / roadmap·quiz 1024 / qna 2048), README truncate.
- **UX:** `stream()`으로 토큰 실시간 표시, `GenerateResponse.latency`·`usage` 배지로 투명성 제공(교육적 가치).
- **중단:** `AbortSignal`로 스트리밍 취소.

---

## 7. 보안 (필수)

SDK의 `VITE_*_KEY`는 **브라우저 번들에 노출**된다. 공개 배포에 그대로 쓰면 키가 유출된다.

### 정책
- **로컬/시연:** `.env.local`의 `VITE_*_KEY` 직접 사용 허용(개발 편의).
- **운영(Vercel):** **Serverless Function 프록시**(`/api/llm`)를 두고 키는 서버 환경변수(`OPENAI_KEY` 등, `VITE_` 접두사 없음)에만 저장.
  - 클라이언트는 우리 `/api/llm`으로만 요청 → 함수가 provider API로 중계(+스트리밍 pass-through).
  - SDK 어댑터의 `baseURL`을 프록시로 스위칭하는 `runtime` 플래그 추가.
- **가드:** 프록시에 요청 origin 제한, 콘텐츠 유형/모델 화이트리스트, 간단한 rate limit.
- README 원문 외 사용자 입력(qna question)은 프롬프트 인젝션 대비 시스템 프롬프트에 경계 명시.

### 환경 변수
| 구분 | 변수 | 위치 |
|------|------|------|
| 개발 | `VITE_OPENAI_KEY`, `VITE_CLAUDE_KEY`, `VITE_GEMINI_KEY`, `VITE_PERPLEXITY_KEY` | `.env.local` |
| 운영 | `OPENAI_KEY`, `CLAUDE_KEY`, `GEMINI_KEY`, `PERPLEXITY_KEY` | Vercel(서버) |
| 공통 | `VITE_AI_RUNTIME` = `direct` \| `proxy` | 런타임 스위치 |

---

## 8. i18n · 디자인 연동

- **i18n:** 스튜디오 UI 문자열은 `ai.*` 네임스페이스로 [ko.ts](../src/i18n/locales/ko.ts)/[en.ts](../src/i18n/locales/en.ts)에 추가. 생성 프롬프트에 현재 로케일 주입.
- **디자인:** Phase 2 토큰(카드·prose·다크) 재사용. 결과는 [MarkdownViewer](../src/components/repository/MarkdownViewer.tsx)로 렌더(코드 하이라이트·다크 대응 그대로).
- **RepositoryMeta 활용:** `brief` 생성 시 추출한 난이도·태그를 [RepositoryMeta](../src/types/repository.ts)에 채워 카드/필터에 반영(선택, 3-C).

---

## 9. UI/UX (AIStudioPanel)

- 위치: Repository 상세 우측 사이드바 아래 또는 README 상단 탭.
- 구성: 콘텐츠 유형 탭(브리핑/로드맵/퀴즈/번역/Q&A/동향) · Provider 선택 · "생성" 버튼 · 스트리밍 출력 · latency/usage 배지 · 복사 버튼.
- 비교 모드(3-B): 토글 시 2~4열 격자, 각 열이 독립 provider 결과.
- 빈/로딩/에러/중단 상태는 기존 [Loading](../src/components/common/Loading.tsx)/[ErrorState](../src/components/common/ErrorState.tsx) 재사용.

---

## 10. 완료 기준(Acceptance)

**Phase 3-A (MVP)**
- [ ] 저장소 상세에서 브리핑·번역·Q&A 3종 생성, 스트리밍 표시
- [ ] provider/model 선택 동작, 잘못된 키/네트워크 오류 시 친화적 에러
- [ ] 결과 24h 캐시(재요청 시 즉시), maxTokens·truncate 적용
- [ ] 한/영 로케일에 맞는 콘텐츠 생성, 다크모드 렌더 정상
- [ ] `tsc -b` 무오류, `npm run build` 성공

**Phase 3-B**: 비교 모드(병렬) + Sonar 최신동향 + 복사/공유
**Phase 3-C**: `/api/llm` 프록시(키 보안) + 앙상블/심판 + RepositoryMeta 자동 태깅

---

## 11. 리스크 & 오픈 이슈

- 브라우저 직접 호출 시 일부 provider **CORS 차단** → 프록시로 해결(3-C, 필요 시 3-A로 앞당김).
- Provider별 모델 ID·파라미터 편차 → SDK 어댑터가 흡수하나 신규 모델 추가 시 `config` 갱신 필요.
- 비용 폭주 방지 정책(캐시·상한·수동 트리거)을 초기부터 강제.
- 실제 API 키는 사용자가 발급/설정해야 함(문서화 필요).

## 12. 단계별 로드맵 요약
- **3-A**: 콘텐츠 스튜디오 MVP(브리핑/번역/Q&A, 선택 모드, 로컬 키)
- **3-B**: 비교 모드 + 최신동향(Sonar) + 공유
- **3-C**: 프록시 보안 + 앙상블/심판 + 메타 자동 태깅
