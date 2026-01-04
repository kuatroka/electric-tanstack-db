import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch, type SearchResult } from "../hooks/useSearch";

export function GlobalSearch() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results } = useSearch(input);

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on category
    const route =
      result.category === "asset"
        ? `/category/${result.code}/${result.cusip}`
        : `/category/${result.code}`;

    navigate(route);

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search (min 2 characters)..."
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />

        {/* Dropdown Results */}
        {input.length >= 2 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              maxHeight: "300px",
              overflowY: "auto",
              marginTop: "0",
              zIndex: 1001,
            }}
          >
            {results.length === 0 ? (
              <div
                style={{
                  padding: "1rem",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                No results found
              </div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {results.map((result, index) => (
                  <li
                    key={`${result.category}-${result.code}-${result.cusip || ""}`}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      backgroundColor:
                        index === highlightedIndex ? "#f0f0f0" : "white",
                      borderBottom: "1px solid #eee",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "0.95rem",
                      }}
                    >
                      {result.code}
                    </div>
                    {result.name && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginTop: "0.25rem",
                        }}
                      >
                        {result.name}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#999",
                        marginTop: "0.25rem",
                      }}
                    >
                      {result.category === "asset"
                        ? `Asset • CUSIP: ${result.cusip}`
                        : `Superinvestor`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
