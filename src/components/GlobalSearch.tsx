import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSearch, type SearchResult } from "../hooks/useSearch";
import { LatencyBadge } from "@/components/LatencyBadge";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, latencyMs, dataFlow, isLoading } = useSearch(input);
  const shouldSearch = input.length >= 2;

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on category
    if (result.category === "assets") {
      navigate({ to: "/assets/$code", params: { code: result.code } });
    } else {
      navigate({ to: "/superinvestors/$cik", params: { cik: result.code } });
    }

    // Clear search
    setInput("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!input || input.length < 2) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleResultClick(results[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setInput("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative w-full sm:w-[30rem]">
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search (min 2 characters)..."
          className="w-full sm:w-[30rem] pr-24"
        />
        {latencyMs !== undefined && shouldSearch && !isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <LatencyBadge
              latencyMs={latencyMs}
              source={dataFlow}
            />
          </div>
        )}
        {isLoading && shouldSearch && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            ...
          </span>
        )}
      </div>

      {/* Dropdown Results */}
      {input.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full sm:w-[30rem] max-h-[400px] overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.category}-${result.code}-${result.cusip || ""}`}
                type="button"
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted ${
                  index === highlightedIndex ? "bg-muted" : ""
                }`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex flex-col truncate mr-2">
                  {result.category === "assets" ? (
                    <>
                      <span className="truncate">
                        <span className="font-bold">{result.code}</span>
                        {result.name && <span> - {result.name}</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.cusip || ""}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="truncate">{result.name || result.code}</span>
                      <span className="text-xs text-muted-foreground">
                        {result.code}
                      </span>
                    </>
                  )}
                </div>
                <span className="ml-auto text-xs uppercase text-muted-foreground">
                  {result.category}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
