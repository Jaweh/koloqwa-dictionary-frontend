export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface WordSummary {
  id: string;
  headword: string;
  slug: string;
  partOfSpeech: string;
  category: string;
  languageCode: string | null;
  languageName: string | null;
  firstDefinition: string;
  status: string;
  publishedAt: string | null;
}

export interface WordDetail {
  id: string;
  headword: string;
  slug: string;
  partOfSpeech: string;
  pronunciation: string | null;
  audioUrl: string | null;
  tags: string[];
  category: string;
  status: string;
  languageCode: string | null;
  languageName: string | null;
  definitions: Definition[];
  publishedAt: string | null;
  createdAt: string;
}

export interface Definition {
  id: string;
  sortOrder: number;
  definition: string;
  usageNote: string | null;
  register: string | null;
  examples: Example[];
}

export interface Example {
  id: string;
  sentence: string;
  translation: string | null;
}

export interface PhraseSummary {
  id: string;
  phraseText: string;
  slug: string;
  category: string;
  languageCode: string | null;
  languageName: string | null;
  firstMeaning: string;
  status: string;
  publishedAt: string | null;
}

export interface PhraseDetail {
  id: string;
  phraseText: string;
  slug: string;
  literalMeaning: string | null;
  tags: string[];
  category: string;
  status: string;
  languageCode: string | null;
  languageName: string | null;
  meanings: Meaning[];
  publishedAt: string | null;
  createdAt: string;
}

export interface Meaning {
  id: string;
  sortOrder: number;
  meaning: string;
  contextNote: string | null;
}

export interface SearchParams {
  q?: string;
  category?: string;
  lang?: string;
  pos?: string;
  page?: number;
  pageSize?: number;
}
