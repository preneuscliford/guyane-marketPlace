"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  className = "", 
  placeholder = "Rechercher un produit...",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <Search className="absolute left-2 sm:left-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-8 sm:h-10 w-full rounded-md border border-input bg-background pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-2 sm:right-3 text-muted-foreground hover:text-foreground p-1"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      )}
    </form>
  );
}