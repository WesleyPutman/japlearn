export default function useDictionaryRenderers() {
  function truncateText(text, maxWords = 2) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  // Fonction pour rendre un élément kanji
  const renderKanjiItem = (k) => (
    <li key={`kanji-${k.id}`} className="p-5 rounded-2xl border-blue-900 border-4 flex items-center h-[133px] mb-3 w-full">
      <span className="text-5xl mr-4">{k.character}</span>
      <div>
        <div className="text-sm">
          {k.grade && `Grade ${k.grade}`} 
          {k.jlpt && ` • JLPT N${k.jlpt}`}
          {k.strokeCount && ` • ${k.strokeCount} traits`}
        </div>
        <div>{truncateText((k.meaningEn || []).join(", "))}</div>
        <div className="text-sm">
          {k.onyomi?.length > 0 && <>On: {k.onyomi.join(", ")}</>}
          {k.kunyomi?.length > 0 && <> • Kun: {k.kunyomi.join(", ")}</>}
        </div>
      </div>
    </li>
  );

  // Fonction pour rendre un élément mot avec formes alternatives
  const renderWordItem = (w) => {
    // Extraire et tronquer la définition
    const definition = w.senses?.length > 0
      ? truncateText(w.senses[0].glosses
          ?.filter(g => g.lang === "eng")
          .map(g => g.text)
          .join(", "), 5)
      : "";
      
    // Vérifier les formes alternatives
    const mainKanji = w.mainKanjiText || w.kanjis?.[0]?.text || "";
    const altKanjis = w.altKanjis || w.kanjis?.slice(1) || [];
    const hasAltKanjis = altKanjis.length > 0;
    
    return (
      <li key={`word-${w.id}`} className="p-5 rounded-2xl border-blue-900 border-4 flex flex-col h-auto mb-3 w-full">
        <div className="flex items-center">
          <span className="text-3xl mr-4">{mainKanji}</span>
          <span className="text-lg">
            {w.mainKanaText || w.kanas?.map(k => k.text).join(", ") || ""}
          </span>
          {w.common && <span className="ml-2 px-1 text-xs bg-red-500 text-green-800 rounded">commun</span>}
        </div>
        
        {/* Affichage des formes alternatives si présentes */}
        {hasAltKanjis && (
          <div className="mt-2 text-sm">
            <span className="text-gray-400">Autres formes:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {altKanjis.map((k, i) => (
                <span key={`alt-k-${i}`} className="inline-block px-2 py-0.5 bg-gray-800 rounded">
                  {k.text}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 overflow-hidden text-ellipsis">
          {definition}
        </div>
      </li>
    );
  };

  // Modifier la fonction renderMixedItem pour la partie mot
  const renderMixedItem = (item) => {
    if (item.type === 'kanji') {
      return (
        <li key={`mixed-kanji-${item.id}`} className="p-5 rounded-2xl border-blue-900 border-4 flex items-center h-[133px] mb-3 w-full">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-500 text-blue-800 rounded-full mr-3 text-xs font-bold">漢</div>
          <span className="text-4xl mr-4">{item.display}</span>
          <div>
            <div className="">{item.meaning}</div>
            <div className="text-sm">
              {item.grade && `Grade ${item.grade}`} 
              {item.jlpt && ` • JLPT N${item.jlpt}`}
            </div>
          </div>
        </li>
      );
    } else {
      // Pour les mots - avec support des formes alternatives
      const truncatedMeaning = truncateText(item.meaning, 5);
      
      // Vérifier les formes alternatives
      const mainKanji = item.mainKanjiText || item.display;
      const altKanjis = item.altKanjis || (item.kanjis?.length > 1 ? item.kanjis.slice(1) : []);
      const hasAltKanjis = altKanjis.length > 0;
      
      return (
        <li key={`mixed-word-${item.id}`} className="p-5 rounded-2xl border-blue-900 border-4 flex flex-col h-auto mb-3 w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-500 text-green-800 rounded-full mr-3 text-xs font-bold">単</div>
            <span className="text-3xl mr-4">{mainKanji}</span>
            <span className="text-lg">{item.reading}</span>
            {item.common && <span className="ml-2 px-1 text-xs bg-red-500 text-green-800 rounded">commun</span>}
          </div>
          
          {/* Affichage des formes alternatives si présentes */}
          {hasAltKanjis && (
            <div className="mt-2 ml-11 text-sm">
              <span className="text-gray-400">Autres formes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {altKanjis.map((k, i) => (
                  <span key={`mixed-alt-k-${i}`} className="inline-block px-2 py-0.5 bg-gray-800 rounded">
                    {k.text}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-2 ml-11 overflow-hidden text-ellipsis">{truncatedMeaning}</div>
        </li>
      );
    }
  };

  return {
    truncateText,
    renderKanjiItem,
    renderWordItem,
    renderMixedItem
  };
}