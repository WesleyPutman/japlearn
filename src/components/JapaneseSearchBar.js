"use client"

import { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import SearchBar from "./SearchBar";

export default function JapaneseSearchBar({ className = "" }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback((query) => {
    router.push(`/dictionnary?q=${encodeURIComponent(query)}`);
  }, [router]);

  const fetchSuggestions = useCallback(async (value) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=8`);
      const data = await res.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  }, []);

  const handleSelectSuggestion = useCallback((suggestion) => {
    if (suggestion.type === 'kanji') {
      router.push(`/kanji/${encodeURIComponent(suggestion.character)}`);
    } else if (suggestion.type === 'word') {
      router.push(`/word/${encodeURIComponent(suggestion.character)}`);
    } else if (suggestion.type === 'meaning') {
      router.push(`/dictionnary?q=${encodeURIComponent(suggestion.meaning)}`);
    }
  }, [router]);

  const renderSuggestion = useCallback((suggestion, index, onSelect) => {
    if (suggestion.type === 'meaning') {
      return (
        <div 
          key={`meaning-${index}`} 
          className="px-4 py-2 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
          onMouseDown={() => onSelect(suggestion)}
        >
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-9 w-9 rounded-md bg-purple-900/30">
              <span className="text-xl text-purple-400">
                {suggestion.source === 'kanji' ? suggestion.character : (suggestion.character || "A")}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-purple-300">
              {suggestion.meaning}
            </div>
            {suggestion.source === 'word' && suggestion.reading && (
              <div className="text-xs text-gray-400">
                {suggestion.reading}
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <span className="px-2 py-0.5 bg-purple-800 text-xs rounded-full">
              {suggestion.source === 'kanji' ? 'kanji' : 'mot'}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={`${suggestion.type}-${suggestion.id}`} 
        className="px-4 py-2 hover:bg-blue-800 cursor-pointer flex items-center gap-3"
        onMouseDown={() => onSelect(suggestion)}
      >
        <div className="flex-shrink-0">
          <div className={`flex items-center justify-center h-9 w-9 rounded-md ${
            suggestion.type === 'kanji' ? 'bg-yellow-900/30' : 'bg-green-900/30'
          }`}>
            <span className={`text-xl ${
              suggestion.type === 'kanji' ? 'text-yellow-500' : 'text-green-400'
            }`}>
              {suggestion.character}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {suggestion.type === 'word' && suggestion.reading && (
            <div className="text-sm text-gray-300">{suggestion.reading}</div>
          )}
          <div className="text-xs text-gray-400 truncate">
            {suggestion.meaning}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-1">
          {suggestion.type === 'kanji' && suggestion.grade && (
            <span className="px-2 py-0.5 bg-blue-700 text-xs rounded-full">
              G{suggestion.grade}
            </span>
          )}
          {suggestion.type === 'kanji' && suggestion.jlpt && (
            <span className="px-2 py-0.5 bg-green-700 text-xs rounded-full">
              N{suggestion.jlpt}
            </span>
          )}
          {suggestion.type === 'word' && suggestion.common && (
            <span className="px-2 py-0.5 bg-red-700 text-xs rounded-full">
              commun
            </span>
          )}
        </div>
      </div>
    );
  }, []);

  return (
    <SearchBar
      placeholder="Rechercher un mot, kanji ou signification..."
      onSearch={handleSearch}
      fetchSuggestions={fetchSuggestions}
      onSelectSuggestion={handleSelectSuggestion}
      renderSuggestion={renderSuggestion}
      minQueryLength={2}
      debounceMs={300}
      className={className}
    />
  );
}