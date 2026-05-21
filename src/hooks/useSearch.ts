"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { searchWords, searchPhrases } from "@/lib/api";
import type { PagedResult, WordSummary, PhraseSummary } from "@/types/dictionary";

type SearchType = "words" | "phrases";

interface UseSearchResult<T> {
  results: PagedResult<T> | null;
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
}

export function useWordSearch(initialQuery = ""): UseSearchResult<WordSummary> {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PagedResult<WordSummary> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchWords({ q: debouncedQuery, page });
        if (!cancelled) setResults(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [debouncedQuery, page]);

  return { results, loading, error, query, setQuery, page, setPage };
}

export function usePhraseSearch(initialQuery = ""): UseSearchResult<PhraseSummary> {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PagedResult<PhraseSummary> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchPhrases({ q: debouncedQuery, page });
        if (!cancelled) setResults(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [debouncedQuery, page]);

  return { results, loading, error, query, setQuery, page, setPage };
}
