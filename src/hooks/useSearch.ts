import { useState, useEffect, useRef } from "react";
import { SearchResult, shapes } from "../lib/electric";

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
  const shapeRef = useRef<ReturnType<typeof shapes.searches> | null>(null);
  const subscribedRef = useRef(false);

  useEffect(() => {
    // Initialize shape on first interaction (lazy loading)
    if (!shapeRef.current) {
      shapeRef.current = shapes.searches();
    }

    // Reset if query is too short
    if (query.length < 2) {
      setResults([]);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    // Subscribe to shape on first search
    if (!subscribedRef.current && shapeRef.current) {
      subscribedRef.current = true;
      shapeRef.current.subscribe(() => {
        // Trigger search after subscription
      });
    }

    setIsLoading(true);

    // Execute search with pglite query (instant, no network)
    const executeSearch = async () => {
      try {
        if (!shapeRef.current) {
          throw new Error("Search shape not initialized");
        }

        // Get rows from shape (pglite data)
        const allRows = shapeRef.current.rows as SearchResult[];

        // Filter by code/name fields (case-insensitive substring match)
        const queryLower = query.toLowerCase();
        const filtered = (allRows || [])
          .filter((item) => {
            const codeLower = item.code.toLowerCase();
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
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
  }, [query]);

  return { results, isLoading, error };
}
