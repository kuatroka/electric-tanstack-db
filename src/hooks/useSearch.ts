import { useState, useEffect, useRef } from "react";
import { shapes } from "../lib/electric";

export type SearchResult = {
  id: number;
  code: string;
  name: string | null;
  category: string;
  cusip: string | null;
};

export interface UseSearchResult {
  results: SearchResult[];
  isLoading: boolean;
  error?: string;
}

/**
 * Hook for instant, offline-capable search using Electric pglite
 * Minimum 2 characters required before returning results
 * Returns first 10 matches, filtered by code/name (case-insensitive substring)
 */
export function useSearch(query: string): UseSearchResult {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const dataRef = useRef<SearchResult[]>([]);

  // Initialize shape and subscribe to data changes
  useEffect(() => {
    const shape = shapes.searches();

    // Subscribe to get data updates from Electric
    const unsubscribe = shape.subscribe(({ rows }) => {
      // Store the rows in ref for use by search effect
      dataRef.current = (rows || []) as SearchResult[];
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Execute search when query changes
  useEffect(() => {
    // Reset if query is too short
    if (query.length < 2) {
      setResults([]);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Execute search immediately (pglite is instant)
    try {
      const allRows = dataRef.current;

      if (!Array.isArray(allRows) || allRows.length === 0) {
        setResults([]);
        setError(undefined);
        setIsLoading(false);
        return;
      }

      // Filter by code/name fields (case-insensitive substring match)
      const queryLower = query.toLowerCase();
      const filtered = allRows
        .filter((item) => {
          if (!item) return false;
          const codeLower = (item.code || "").toLowerCase();
          const nameLower = (item.name || "").toLowerCase();
          return (
            codeLower.includes(queryLower) ||
            nameLower.includes(queryLower)
          );
        })
        .slice(0, 10); // Limit to first 10 results

      setResults(filtered);
      setError(undefined);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Search failed";
      setError(errorMsg);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return { results, isLoading, error };
}
