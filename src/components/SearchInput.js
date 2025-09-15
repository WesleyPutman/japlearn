"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from './Input';

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // Récupérer la dernière recherche au chargement
  useEffect(() => {
    const savedQuery = localStorage.getItem('japlearn_last_search');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  // Fonction pour chercher des suggestions
  const fetchSuggestions = async (value) => {
    if (value.length < 2) return;
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`);
      const data = await res.json();
      
      const extractedSuggestions = [];
      
      // Extraire les significations des kanji
      data.results?.kanji?.forEach(k => {
        k.meaningEn?.forEach(meaning => {
          if (!extractedSuggestions.includes(meaning)) {
            extractedSuggestions.push(meaning);
          }
        });
      });
      
      // Extraire les significations des mots
      data.results?.words?.forEach(w => {
        w.senses?.[0]?.glosses?.forEach(g => {
          if (g.lang === "eng" && !extractedSuggestions.includes(g.text)) {
            extractedSuggestions.push(g.text);
          }
        });
      });
      
      setSuggestions(extractedSuggestions.slice(0, 10));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Mettre en place un debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Sauvegarder et rediriger
      localStorage.setItem('japlearn_last_search', query);
      router.push(`/dictionnary?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    localStorage.setItem('japlearn_last_search', suggestion);
    router.push(`/dictionnary?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input type="text" value={query} onChange={handleInputChange} placeholder="Rechercher un mot ou un kanji..." className="w-full" data={suggestions} showSuggestions={suggestions.length > 0} onSelectSuggestion={handleSelectSuggestion}/>
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-blue-300" aria-label="Rechercher">
        </button>
      </div>
    </form>
  );
}