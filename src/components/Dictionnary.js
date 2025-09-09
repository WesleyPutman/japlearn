"use client";
import dynamic from "next/dynamic";
import useDictionaryData from '@/hooks/useDictionaryData';
import useDictionaryRenderers from '@/hooks/useDictionaryRenderers';

const Input = dynamic(() => import('@/components/Input'), { ssr: false });
const Button = dynamic(() => import('@/components/Button'), { ssr: false });
const Separator = dynamic(() => import('@/components/Separator'), { ssr: false });

export default function Dictionary() {
  // Récupération des données et des états via le hook
  const { kanjis, words, mixedResults, activeTab, pageKanji, pageWord, pageMixed, q, loadingKanji, loadingWord, loadingMixed, totalPagesKanjis, totalPagesWords, totalPagesMixed, handleTabChange, handleSearch, setPageKanji, setPageWord, setPageMixed, suggestions
  } = useDictionaryData();
  
  // Récupération des fonctions de rendu
  const {
    renderKanjiItem, renderWordItem, renderMixedItem
  } = useDictionaryRenderers();

  return (
    <div className="flex flex-col items-center justify-center">
      <Input type="search" value={q} onChange={e => handleSearch(e.target.value)} placeholder="Rechercher" data={suggestions} showSuggestions={true} onSelectSuggestion={s => handleSearch(s)} className="w-full" />
      <Separator/>
      
      <div className="w-full flex justify-around mb-10">
        <Button onClick={() => handleTabChange("all")} variant="text"isActive={activeTab === "all"}className="flex-1 rounded-none">Tous</Button>
        <Button onClick={() => handleTabChange("word")} variant="text"isActive={activeTab === "word"}className="flex-1 rounded-none">Mots</Button>
        <Button onClick={() => handleTabChange("kanji")} variant="text"isActive={activeTab === "kanji"}className="flex-1 rounded-none">Kanji</Button>
      </div>
      
      {/* Affichage des résultats mixtes */}
      {activeTab === "all" && (
        <div className="mb-8">
          {loadingMixed ? (
            <div className="py-4 text-center">Chargement des résultats...</div>
          ) : mixedResults.length > 0 ? (
            <>
              <ul className="w-full">
                {mixedResults.map(renderMixedItem)}
              </ul>
              <div className="flex items-center justify-between mt-4">
                <Button onClick={() => setPageMixed(p => Math.max(1, p - 1))}variant="default" disabled={pageMixed === 1}>Précédent</Button>
                <span>Page {pageMixed} / {totalPagesMixed}</span>
                <Button onClick={() => setPageMixed(p => Math.min(totalPagesMixed, p + 1))}variant="secondary" disabled={pageMixed === totalPagesMixed}>Suivant</Button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">Aucun résultat trouvé</div>
          )}
        </div>
      )}
      
      {/* Affichage des mots */}
      {activeTab === "word" && (
        <div className="mb-8 w-full">
          {loadingWord ? (
            <div className="py-4 text-center">Chargement des mots...</div>
          ) : words.length > 0 ? (
            <>
              <ul className="w-full">
                {words.map(renderWordItem)}
              </ul>
              <div className="flex items-center justify-between mt-4">
                <Button onClick={() => setPageWord(p => Math.max(1, p - 1))} disabled={pageWord === 1} size="sm">← Précédent</Button>
                <span>Page {pageWord} / {totalPagesWords}</span>
                <Button onClick={() => setPageWord(p => Math.min(totalPagesWords, p + 1))} disabled={pageWord === totalPagesWords} size="sm">Suivant →</Button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">Aucun mot trouvé</div>
          )}
        </div>
      )}
      
      {/* Affichage des kanji */}
      {activeTab === "kanji" && (
        <div className="w-full">
          {loadingKanji ? (
            <div className="py-4 text-center">Chargement des kanji...</div>
          ) : kanjis.length > 0 ? (
            <>
              <ul className="w-full">
                {kanjis.map(renderKanjiItem)}
              </ul>
              <div className="flex items-center justify-between mt-4">
                <Button onClick={() => setPageKanji(p => Math.max(1, p - 1))} disabled={pageKanji === 1} size="sm">← Précédent</Button>
                <span>Page {pageKanji} / {totalPagesKanjis}</span>
                <Button onClick={() => setPageKanji(p => Math.min(totalPagesKanjis, p + 1))} disabled={pageKanji === totalPagesKanjis} size="sm">Suivant →</Button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">Aucun kanji trouvé</div>
          )}
        </div>
      )}
    </div>
  );
}