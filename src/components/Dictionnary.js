"use client";
import dynamic from "next/dynamic";
import useDictionaryData from '@/hooks/useDictionaryData';
import useDictionaryRenderers from '@/hooks/useDictionaryRenderers';

const Input = dynamic(() => import('@/components/Input'), { ssr: false });
const Button = dynamic(() => import('@/components/Button'), { ssr: false });
const Separator = dynamic(() => import('@/components/Separator'), { ssr: false });
const ResultsView = dynamic(() => import('@/components/ResultsView'), { ssr: false });

export default function Dictionary() {
  const { kanjis, words, mixedResults, activeTab, pageKanji, pageWord, pageMixed, q, loadingKanji, loadingWord, loadingMixed, totalPagesKanjis, totalPagesWords, totalPagesMixed, handleTabChange, handleSearch, setPageKanji, setPageWord, setPageMixed, suggestions
  } = useDictionaryData();
  
  const { renderKanjiItem,  renderWordItem,  renderMixedItem
  } = useDictionaryRenderers();

  const resultsConfig = {
    all: {
      items: mixedResults,
      renderItem: renderMixedItem,
      loading: loadingMixed,
      page: pageMixed,
      totalPages: totalPagesMixed,
      setPage: setPageMixed,
      loadingMessage: "Chargement des résultats...",
      emptyMessage: "Aucun résultat trouvé"
    },
    word: {
      items: words,
      renderItem: renderWordItem,
      loading: loadingWord,
      page: pageWord,
      totalPages: totalPagesWords,
      setPage: setPageWord,
      loadingMessage: "Chargement des mots...",
      emptyMessage: "Aucun mot trouvé"
    },
    kanji: {
      items: kanjis,
      renderItem: renderKanjiItem,
      loading: loadingKanji,
      page: pageKanji,
      totalPages: totalPagesKanjis,
      setPage: setPageKanji,
      loadingMessage: "Chargement des kanji...",
      emptyMessage: "Aucun kanji trouvé"
    }
  };

  const currentConfig = resultsConfig[activeTab];

  return (
    <div className="w-full max-w-full lg:max-w-[600px] mx-auto flex flex-col items-center justify-center">
      <Input type="search" value={q} onChange={e => handleSearch(e.target.value)} placeholder="Rechercher" data={suggestions} showSuggestions={true} onSelectSuggestion={s => handleSearch(s)} className="w-full" />
      <Separator/>
      
      <div className="w-full flex justify-around mb-10">
        <Button onClick={() => handleTabChange("all")} variant="text" isActive={activeTab === "all"} className="flex-1 rounded-none">Tous</Button>
        <Button onClick={() => handleTabChange("word")} variant="text" isActive={activeTab === "word"} className="flex-1 rounded-none">Mots</Button>
        <Button onClick={() => handleTabChange("kanji")} variant="text" isActive={activeTab === "kanji"} className="flex-1 rounded-none">Kanji</Button>
      </div>
      
      <ResultsView {...currentConfig} className="mb-8" />
    </div>
  );
}