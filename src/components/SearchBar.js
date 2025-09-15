"use client"

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant SearchBar réutilisable avec suggestions
 * @param {Object} props
 * @param {string} [props.placeholder="Rechercher..."] - Texte placeholder
 * @param {Function} props.onSearch - Fonction appelée à la soumission (reçoit la requête)
 * @param {Function} props.fetchSuggestions - Fonction asynchrone pour récupérer les suggestions (reçoit la requête)
 * @param {Function} props.onSelectSuggestion - Fonction appelée quand une suggestion est sélectionnée
 * @param {Function} props.renderSuggestion - Fonction pour personnaliser le rendu des suggestions
 * @param {number} [props.minQueryLength=2] - Longueur minimale avant de déclencher la recherche
 * @param {number} [props.debounceMs=300] - Délai en ms avant de déclencher la recherche
 * @param {string} [props.className=""] - Classes CSS supplémentaires
 * @param {string} [props.suggestionClassName=""] - Classes CSS pour le conteneur des suggestions
 */
export default function SearchBar({
  placeholder = "Rechercher...",
  onSearch,
  fetchSuggestions,
  onSelectSuggestion,
  renderSuggestion,
  minQueryLength = 2,
  debounceMs = 300,
  className = "",
  suggestionClassName = "",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Récupération des suggestions avec debounce
  const debouncedFetchSuggestions = useCallback(async (value) => {
    if (!fetchSuggestions || value.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(value);
        setSuggestions(results || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [fetchSuggestions, minQueryLength, debounceMs]);

  // Gestionnaire de changement d'entrée
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchSuggestions(value);
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && query.length >= minQueryLength) {
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  // Gestionnaire de sélection de suggestion
  const handleSelectSuggestion = (suggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    
    // Réinitialiser l'état après sélection
    setQuery("");
    setSuggestions([]);
  };

  // Focus et blur
  const handleFocus = () => {
    setFocused(true);
    if (query.length >= minQueryLength) {
      debouncedFetchSuggestions(query);
    }
  };

  const handleBlur = () => {
    // Petit délai pour permettre le clic sur une suggestion
    setTimeout(() => {
      setFocused(false);
    }, 150);
  };

  // Rendu par défaut d'une suggestion
  const defaultRenderSuggestion = (suggestion, index) => (
    <div 
      key={index}
      className="px-4 py-2 hover:bg-blue-800 cursor-pointer"
      onMouseDown={() => handleSelectSuggestion(suggestion)}
    >
      {typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion)}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full rounded-2xl bg-blue-900 h-12 px-5 pr-10 placeholder-blue-300 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          
          {loading ? (
            <div className="absolute top-0 right-0 h-full flex items-center pr-3">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            query && (
              <button
                type="button"
                className="absolute top-0 right-0 h-full flex items-center pr-3 text-blue-300 hover:text-blue-100"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )
          )}
        </div>
      </form>
      
      {focused && suggestions.length > 0 && (
        <div className={`absolute z-50 mt-1 w-full bg-blue-950 border border-blue-800 rounded-lg shadow-lg max-h-80 overflow-y-auto ${suggestionClassName}`}>
          {suggestions.map((suggestion, index) => 
            renderSuggestion 
              ? renderSuggestion(suggestion, index, handleSelectSuggestion)
              : defaultRenderSuggestion(suggestion, index)
          )}
        </div>
      )}
    </div>
  );
}