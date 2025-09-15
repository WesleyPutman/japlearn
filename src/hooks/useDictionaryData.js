import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function useDictionaryData() {
  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // États pour les données
  const [kanjis, setKanjis] = useState([]);
  const [words, setWords] = useState([]);
  const [mixedResults, setMixedResults] = useState([]);
  const [totalKanjis, setTotalKanjis] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [totalMixed, setTotalMixed] = useState(0);
  
  // États pour l'UI
  const [activeTab, setActiveTab] = useState("all"); // "all", "kanji", "word"
  const [pageKanji, setPageKanji] = useState(1);
  const [pageWord, setPageWord] = useState(1);
  const [pageMixed, setPageMixed] = useState(1);
  const [q, setQ] = useState("");
  const [loadingKanji, setLoadingKanji] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);
  const [loadingMixed, setLoadingMixed] = useState(false);

  // Synchronisation initiale avec l'URL et le localStorage
  useEffect(() => {
    // Récupérer la recherche depuis les paramètres d'URL
    const queryParam = searchParams.get('q');

    if (queryParam) {
      // Si on a une recherche dans l'URL, on la priorise
      setQ(queryParam);
      // Et on la sauvegarde dans le localStorage pour persistance entre pages
      typeof window !== 'undefined' && localStorage.setItem('japlearn_last_search', queryParam);
    } else if (typeof window !== 'undefined') {
      // Sinon, récupérer la dernière recherche depuis localStorage
      const savedQuery = localStorage.getItem('japlearn_last_search');
      if (savedQuery) {
        setQ(savedQuery);
        
        // Si on est sur la page dictionnary, mettre à jour l'URL sans reload
        if (pathname === '/dictionnary') {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('q', savedQuery);
          router.replace(`/dictionnary?${newParams.toString()}`);
        }
      }
    }
  }, [searchParams, router, pathname]);

  // Calculer le nombre de pages total
  const totalPagesKanjis = Math.max(1, Math.ceil(totalKanjis / 10));
  const totalPagesWords = Math.max(1, Math.ceil(totalWords / 10));
  const totalPagesMixed = Math.max(1, Math.ceil(totalMixed / 20));

  // Effet pour les résultats mixtes (onglet "Tous")
  useEffect(() => {
    if (q && activeTab === "all") {
      setLoadingMixed(true);
      Promise.all([
        fetch(`/api/kanji?page=${pageMixed}&q=${encodeURIComponent(q)}`).then(res => res.json()),
        fetch(`/api/word?page=${pageMixed}&q=${encodeURIComponent(q)}`).then(res => res.json())
      ]).then(([kanjiData, wordData]) => {
        // Formatter les données pour qu'elles aient une structure commune
        const formattedKanjis = (kanjiData.kanji || []).map(k => ({
          ...k,
          type: 'kanji',
          frequency: k.frequency || 9999,
          display: k.character,
          meaning: (k.meaningEn || []).join(", ")
        }));
        
        const formattedWords = (wordData.word || []).map(w => ({
          ...w,
          type: 'word',
          frequency: w.frequency || 9999,
          display: w.kanjis.map(k => k.text).join(""),
          reading: w.kanas.map(k => k.text).join(", "),
          meaning: w.senses.flatMap(s => s.glosses.filter(g => g.lang === "eng").map(g => g.text)).join(", ")
        }));
        
        // Combiner et trier par fréquence
        const combined = [...formattedKanjis, ...formattedWords]
          .sort((a, b) => a.frequency - b.frequency);
        
        setMixedResults(combined.slice(0, 20));
        setTotalMixed(kanjiData.total + wordData.total);
      })
      .catch(err => console.error("Erreur chargement mixte:", err))
      .finally(() => setLoadingMixed(false));
    } else {
      setMixedResults([]);
      setTotalMixed(0);
    }
  }, [pageMixed, q, activeTab]);

  // Effet pour les kanji
  useEffect(() => {
    if (q && activeTab === "kanji") {
      setLoadingKanji(true);
      fetch(`/api/kanji?page=${pageKanji}&q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          setKanjis(data.kanji || []);
          setTotalKanjis(data.total || 0);
        })
        .catch(err => console.error("Erreur chargement kanji:", err))
        .finally(() => setLoadingKanji(false));
    } else if (activeTab === "kanji") {
      setKanjis([]);
      setTotalKanjis(0);
    }
  }, [pageKanji, q, activeTab]);

  // Effet pour les mots
  useEffect(() => {
    if (q && activeTab === "word") {
      setLoadingWord(true);
      fetch(`/api/word?page=${pageWord}&q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          setWords(data.word || []);
          setTotalWords(data.total || 0);
        })
        .catch(err => console.error("Erreur chargement mots:", err))
        .finally(() => setLoadingWord(false));
    } else if (activeTab === "word") {
      setWords([]);
      setTotalWords(0);
    }
  }, [pageWord, q, activeTab]);

  // Suggestions pour l'input
  const suggestions = activeTab === "all" 
    ? mixedResults.flatMap(item => {
        if (item.type === 'kanji') {
          return [item.character, ...(item.meaningEn || [])];
        } else {
          return [
            ...(item.kanjis?.map(k => k.text) || []), 
            ...(item.kanas?.map(k => k.text) || []),
            ...(item.senses?.flatMap(s => s.glosses?.map(g => g.text) || []) || [])
          ];
        }
      })
    : activeTab === "kanji"
      ? [...kanjis.map(k => k.character), ...kanjis.flatMap(k => k.meaningEn || [])]
      : [...words.flatMap(w => w.kanjis?.map(k => k.text) || []), 
         ...words.flatMap(w => w.kanas?.map(k => k.text) || []),
         ...words.flatMap(w => w.senses?.flatMap(s => s.glosses?.map(g => g.text) || []) || [])];

  // Gestion du changement d'onglet
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Réinitialiser les pages lors du changement d'onglet
    if (tab === "kanji") setPageKanji(1);
    if (tab === "word") setPageWord(1);
    if (tab === "all") setPageMixed(1);
  }, []);

  // Gestion de la recherche avec mise à jour de l'URL et localStorage
  const handleSearch = useCallback((value) => {
    // Mettre à jour l'état de recherche
    setQ(value);
    
    // Réinitialiser les pages
    setPageKanji(1);
    setPageWord(1);
    setPageMixed(1);
    
    // Sauvegarder dans localStorage pour persistance entre pages
    typeof window !== 'undefined' && localStorage.setItem('japlearn_last_search', value);
    
    // Mettre à jour l'URL si on est sur la page dictionnaire
    if (pathname === '/dictionnary') {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set('q', value);
      } else {
        newParams.delete('q');
      }
      router.replace(`/dictionnary?${newParams.toString()}`);
    }
  }, [router, searchParams, pathname]);

  // Fonction pour naviguer vers la page dictionnaire avec la recherche
  const navigateToSearch = useCallback((value) => {
    // Sauvegarder la recherche
    typeof window !== 'undefined' && localStorage.setItem('japlearn_last_search', value);
    
    // Naviguer vers la page dictionnaire avec la recherche
    router.push(`/dictionnary?q=${encodeURIComponent(value)}`);
  }, [router]);

  return {
    // Données
    kanjis, 
    words, 
    mixedResults, 
    totalKanjis, 
    totalWords, 
    totalMixed,
    
    // État de l'UI
    activeTab, 
    pageKanji, 
    pageWord, 
    pageMixed, 
    q, 
    loadingKanji, 
    loadingWord, 
    loadingMixed,
    
    // Pagination
    totalPagesKanjis, 
    totalPagesWords, 
    totalPagesMixed,
    
    // Fonctions
    handleTabChange,
    handleSearch,
    setQ,
    setPageKanji,
    setPageWord,
    setPageMixed,
    navigateToSearch,
    
    // Autres données dérivées
    suggestions
  };
}