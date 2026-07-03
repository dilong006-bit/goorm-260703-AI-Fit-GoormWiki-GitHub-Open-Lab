import type { TranslationKey } from './ko'

export const en: Record<TranslationKey, string> = {
  // Brand · Navigation
  'brand.name': 'AI-Fit GoormWiki',
  'nav.home': 'Home',
  'nav.search': 'Search',
  'nav.about': 'About',

  // Common
  'common.loading': 'Loading…',
  'common.retry': 'Try again',
  'common.viewMore': 'View more',
  'common.error.title': 'Something went wrong',
  'common.empty.default': 'No projects to display.',
  'common.noDescription': 'No description provided.',

  // Search box
  'searchBox.placeholder': 'Search projects (name, description, language, topic)',
  'searchBox.placeholderShort': 'Search projects…',
  'searchBox.clear': 'Clear search',
  'searchBox.aria': 'Search projects',

  // Theme · Language
  'theme.toggle': 'Toggle theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',
  'lang.switch': 'Switch language',
  'lang.ko': '한국어',
  'lang.en': 'English',

  // Home
  'home.hero.title': 'GitHub Open Lab',
  'home.hero.badge': 'AI-Fit · Phase 2',
  'home.hero.subtitle':
    "Explore {{user}}'s open-source projects as a learner-friendly Wiki.",
  'home.section.categories': 'Categories',
  'home.section.popular': 'Popular projects',
  'home.section.recent': 'Recently updated',
  'home.section.all': 'All projects ({{count}})',

  // Search page
  'search.title': 'Search projects',
  'search.resultInfo': 'Showing {{count}} of {{total}}',
  'search.sortLabel': 'Sort',
  'search.sort.updated': 'Recently updated',
  'search.sort.stars': 'Most stars',
  'search.sort.name': 'Name',
  'search.filter.all': 'All',
  'search.empty': 'No results found. Try a different keyword.',

  // Category page
  'category.back': 'Back to home',
  'category.countSuffix': '{{count}} projects',
  'category.notFound': "Category '{{name}}' not found.",
  'category.empty': 'No projects in this category yet.',

  // Category labels/descriptions (by slug)
  'category.react.label': 'React',
  'category.react.desc': 'React / Next.js frontend projects',
  'category.vue.label': 'Vue',
  'category.vue.desc': 'Vue / Nuxt projects',
  'category.python.label': 'Python',
  'category.python.desc': 'Python scripts, data & backend',
  'category.node.label': 'Node',
  'category.node.desc': 'Node.js / Express server projects',
  'category.ai.label': 'AI',
  'category.ai.desc': 'AI / ML / LLM projects',
  'category.typescript.label': 'TypeScript',
  'category.typescript.desc': 'TypeScript-based projects',
  'category.mobile.label': 'Mobile',
  'category.mobile.desc': 'Flutter / React Native mobile apps',
  'category.etc.label': 'ETC',
  'category.etc.desc': 'Other projects',

  // Repository detail
  'repo.back': 'Back to home',
  'repo.readme': 'README',
  'repo.readmeLoading': 'Rendering README…',
  'repo.loading': 'Loading repository…',
  'repo.noReadme': 'This repository has no README.',
  'repo.notFound': 'Repository not found.',
  'repo.viewOnGithub': 'View on GitHub',
  'repo.openDemo': 'Open demo',
  'repo.meta.language': 'Language',
  'repo.meta.stars': 'Stars',
  'repo.meta.forks': 'Forks',
  'repo.meta.watchers': 'Watchers',
  'repo.meta.license': 'License',
  'repo.meta.updated': 'Updated',

  // About page
  'about.title': 'About AI-Fit GoormWiki',
  'about.subtitle':
    'An open-lab project that explores GitHub repositories as a learner-friendly Wiki.',
  'about.feature.search.title': 'Smart search & filter',
  'about.feature.search.desc':
    'Quickly find projects by name, description, language, and topic, and browse by category.',
  'about.feature.readme.title': 'README Wiki view',
  'about.feature.readme.desc':
    'Document rendering with GFM markdown, code highlighting, and image path resolution.',
  'about.feature.cache.title': '24-hour caching',
  'about.feature.cache.desc':
    'A localStorage cache minimizes GitHub API requests for fast loading.',
  'about.stackTitle': 'Tech stack',
  'about.sourceTitle': 'Data source',
  'about.sourceText':
    'All project data is fetched in real time from the {{user}} account via the GitHub REST API.',

  // AI content studio
  'ai.title': 'AI Content Studio',
  'ai.subtitle': 'Generate learning content from the README',
  'ai.provider': 'Provider',
  'ai.recommended': 'Recommended',
  'ai.generate': 'Generate',
  'ai.regenerate': 'Regenerate',
  'ai.stop': 'Stop',
  'ai.copy': 'Copy',
  'ai.copied': 'Copied',
  'ai.placeholder': 'Pick a type and press “Generate” to create content.',
  'ai.questionPlaceholder': 'Ask anything about this repository…',
  'ai.streaming': 'Generating…',
  'ai.latency': '{{ms}}ms',
  'ai.mockNotice':
    'Running in mock (simulation) mode — no API key found. Add keys to .env.local to connect real LLMs.',
  'ai.type.brief': '3-line brief',
  'ai.type.roadmap': 'Learning roadmap',
  'ai.type.quiz': 'Practice quiz',
  'ai.type.translate': 'Translate README',
  'ai.type.qna': 'Repo Q&A',
  'ai.type.trend': 'Latest trends',

  // Pagination
  'pagination.aria': 'Pagination',
  'pagination.prev': 'Previous page',
  'pagination.next': 'Next page',

  // 404
  'notFound.message': 'Page not found.',
  'notFound.backHome': 'Back to home',
}
