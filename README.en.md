# AI-Fit GoormWiki · GitHub Open Lab

[한국어](README.md) | **English**

A React web app that explores GitHub repositories as a **learner-friendly Wiki** and **generates learning content with multiple LLMs**.

- 🌐 **Live demo:** https://goorm-260703-ai-fit-goormwiki.vercel.app
- 📦 **Repository:** https://github.com/dilong006-bit/goorm-260703-AI-Fit-GoormWiki-GitHub-Open-Lab
- 👤 **Default account:** [@dilong006-bit](https://github.com/dilong006-bit)

---

## Features

### Phase 1 — Core
- Automatic GitHub repository listing (paginated, 200+ repos)
- Project search (name, description, language, topic)
- Category / language filters (React, Vue, Python, Node, AI, …)
- README Markdown rendering (GFM, code highlighting, image path resolution)
- GitHub / demo link navigation
- Responsive UI (mobile 1-col · tablet 2-col · desktop 4-col)
- localStorage 24-hour caching
- `RepositoryMeta` extension interface ready

### Phase 2 — Theme · i18n · Design
- 🌗 **Dark theme** — light/dark toggle + `system` (OS) detection, localStorage persistence, FOUC-prevention inline script, live reaction to OS theme changes
- 🌐 **Internationalization (i18n)** — Korean/English switch, all UI strings dictionaried, date locale (`Intl`) integration, `<html lang>` sync, persisted across visits
- ✨ **Design refresh** — indigo accent tokens (light/dark), Pretendard variable font, hero gradient, card micro-interactions, dark-mode prose & code highlighting

> Spec: [ref/SPEC-Phase2-Theme-i18n-Design.md](ref/SPEC-Phase2-Theme-i18n-Design.md)

### Phase 3 — Multi-LLM Content Studio
- 🤖 **AI Content Studio** — generate learning content from a repo's README: 3-line brief · learning roadmap · practice quiz · README translation · repo Q&A · latest trends
- 🔀 **Multi-LLM gateway** — OpenAI · Claude · Gemini · Perplexity behind a single `generate()` / `stream()` interface (based on [multi-llm-sdk](https://github.com/junsang-dong/goorm-260630-multi-llm-sdk))
- 🧪 **Works instantly without keys** — falls back to `mock` (simulated streaming) when no API key is set; add keys to connect real LLMs
- ⚡ **Streaming · 24h caching · locale-aware** — real-time token output, cached results to cut cost, generated in the current UI language

> Spec: [ref/SPEC-Phase3-Multi-LLM-Content-Studio.md](ref/SPEC-Phase3-Multi-LLM-Content-Studio.md)

---

## Architecture

```
GitHub API ─→ Axios(api.ts) ─→ Repository Service ─→ Zustand Store ─→ React Pages
                                      │                                    │
                                localStorage Cache (24h)                   │
                                                                           ▼
                              README ─→ AI content service ─→ Multi-LLM gateway
                                        (prompts/cache)       generate() / stream()
                                                                           │
                                        ┌──────────────┬──────────┬────────┴─────────┐
                                     OpenAI         Claude      Gemini   Perplexity / mock
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — search, categories, popular/recent projects, full list |
| `/search` | Search — keyword, filters, URL query (`?q=`) |
| `/category/:name` | Browse projects by category |
| `/repository/:name` | Project detail + README + **AI Content Studio** |
| `/about` | About the service |

## Tech Stack

- **Frontend:** React 19 · Vite · TypeScript · TailwindCSS · Shadcn UI · React Router · Zustand · Axios
- **Content:** react-markdown · rehype-highlight · remark-gfm · Lucide React · Pretendard
- **AI:** Multi-LLM gateway (OpenAI · Claude · Gemini · Perplexity · mock)

---

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Dev server
npm run dev

# Production build
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GITHUB_USERNAME` | GitHub username to list | `dilong006-bit` |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token (optional, relaxes rate limit) | - |
| `VITE_OPENAI_KEY` | OpenAI API key (optional) | - |
| `VITE_CLAUDE_KEY` | Anthropic Claude API key (optional) | - |
| `VITE_GEMINI_KEY` | Google Gemini API key (optional) | - |
| `VITE_PERPLEXITY_KEY` | Perplexity API key (optional) | - |

- **GitHub Token:** Create a Fine-grained token (Public repos, Read-only) at [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens). It works without one, but you may hit the rate limit (60/hour); with a token it becomes 5,000/hour.
- **LLM keys:** All optional. **With no keys set, the app runs in `mock` (simulation) mode**; adding a key makes that provider appear in the studio.
- ⚠️ **Security:** `VITE_`-prefixed keys are exposed in the browser bundle. For public deployments, use a serverless proxy ([Phase 3 spec §7](ref/SPEC-Phase3-Multi-LLM-Content-Studio.md)).

## Project Structure

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
├── types/            repository.ts (incl. RepositoryMeta)
├── utils/            filterRepos, formatDate, readmeImages
├── constants/        categories, languages
├── config/           env.ts
└── lib/              utils.ts (cn)
```

## Bug Fix History

### 1. Forced redirect to `/search` on navigation
- **Cause:** The always-mounted `SearchBox` in the header called `onSearch('')` with an empty query on mount → the handler ran `navigate('/search')` even for empty values.
- **Fix:** `SearchBox` uses `userTypedRef` to run the debounced search only when the user actually types. `Header`/`Home` navigate to `/search?q=...` only when a query exists.

### 2. README code / architecture block readability
- **Cause:** Tailwind Typography (`prose`) rendered `pre code` text in light gray, which lost contrast against the light `#f6f8fa` background.
- **Fix:** `.prose-github` overrides text color to dark gray (`#1f2328`) and Typography CSS variables (dark mode maps to the GitHub dark palette).

## Vercel Deployment

1. Push this repository to GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo (Framework Preset: **Vite**, auto-detected).
3. Under **Settings → Environment Variables**, add `VITE_GITHUB_USERNAME` and `VITE_GITHUB_TOKEN` (optional) for Production/Preview/Development.
4. **Deploy** — `vercel.json`'s SPA fallback rewrite keeps React Router routes working.

## Roadmap

- ✅ **Phase 1** — Core wiki (listing, search, filter, README)
- ✅ **Phase 2** — Dark theme · i18n (KO/EN) · design refresh
- ✅ **Phase 3-A** — Multi-LLM Content Studio MVP (mock fallback)
- ⬜ **Phase 3-B** — Compare mode (parallel multi-LLM) · latest trends (Perplexity) · sharing
- ⬜ **Phase 3-C** — Serverless proxy (key security) · ensemble/judge · `RepositoryMeta` auto-tagging

## License

Private — AI-Fit GoormWiki Open Lab
