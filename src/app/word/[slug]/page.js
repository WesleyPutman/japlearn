import { notFound } from "next/navigation";
import Link from "next/link";
import { getWordBySlug } from "@/lib/services/word";
import dynamic from "next/dynamic";

const Heading = dynamic(() => import('@/components/Heading'));

export default async function WordPage({ params }) {
  const word = await getWordBySlug(decodeURIComponent(params.slug));

  if (!word) return notFound();
  
  const mainKanji = word.kanjis[0]?.text || "";
  const reading = word.kanas.map(k => k.text).join(", ");
  
  const allKanjis = word.kanjis.flatMap(k => k.text.split('')).filter(char => {
    const code = char.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF);
  });
  const uniqueKanjis = [...new Set(allKanjis)];
  
  return (
    <div className="p-6 max-w-[600px]">
      <span level="2" className="text-5xl font-bold">{mainKanji}</span>
      <span className="text-2xl font-normal">「{reading}」</span>
      {word.common && <span className="ml-2 px-2 py-1 bg-red-500 text-xs rounded">commun</span>}
      
      {/* Section des kanji composant le mot */}
      {uniqueKanjis.length > 0 && (
        <div className="mt-6">
          <Heading level="2">Kanjis composants</Heading>
          <div className="flex flex-wrap gap-3 mt-3">
            {uniqueKanjis.map((kanji, index) => (
              <Link key={`kanji-${index}`} href={`/kanji/${encodeURIComponent(kanji)}`}>
                <div className="flex flex-col items-center p-3 bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-3xl mb-1">{kanji}</span>
                  <span className="text-xs text-blue-300">Voir détails</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {word.kanjis.length > 1 && (
        <div className="mt-4">
          <Heading level="2">Formes alternatives</Heading>
          <div className="flex flex-wrap gap-2 mt-2">
            {word.kanjis.slice(1).map(k => (
              <span key={k.id} className="px-3 py-1 bg-blue-800 rounded text-lg">{k.text}</span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Heading level="2">Définitions</Heading>
        {word.senses.map((sense, index) => (
          <div key={sense.id} className="mt-4">
            <ul className="ml-6 list-none flex flex-row gap-2 mt-1">{index + 1}.
              {sense.glosses.filter(g => g.lang === "eng").map(g => (
                <li key={g.id}>{g.text},</li>
              ))}
            </ul>
            <ul className="ml-6 list-none mt-2">
              {sense.glosses.filter(g => g.lang === "fra").map(g => (
                <li key={g.id} className="text-gray-300">{g.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}