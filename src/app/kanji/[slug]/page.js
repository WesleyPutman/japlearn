import { notFound } from "next/navigation";
import Link from "next/link";
import { getKanjiByCharacter } from "@/lib/services/kanji";
import dynamic from "next/dynamic";

const Heading = dynamic(() => import('@/components/Heading'));
const SearchInput = dynamic(() => import('@/components/SearchInput'));
const Separator = dynamic(() => import('@/components/Separator'));

export default async function KanjiPage({ params }) {
  const kanjiChar = decodeURIComponent(params.slug);
  const kanji = await getKanjiByCharacter(kanjiChar);

  if (!kanji) return notFound();

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-[800px]">
        {/* SearchInput prendra toute la largeur disponible */}
        <SearchInput />
        
        {/* Separator centré avec un padding vertical */}
        <div className="flex justify-center py-4">
          <Separator className="w-24" />
        </div>
      </div>
      
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-4">
          <span className="text-6xl font-bold">{kanji.character}</span>
          <div>
            <div className="px-2 py-1 bg-blue-700 rounded text-sm inline-block mb-1">
              Grade {kanji.grade || "—"}
            </div>
            {kanji.jlpt && (
              <div className="px-2 py-1 bg-red-500 rounded text-sm ml-2 inline-block mb-1">
                JLPT N{kanji.jlpt}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Heading level="2" className="mb-2">Signification</Heading>
            <p className="mb-3">
              <span className="text-blue-400">EN:</span> {kanji.meaningEn?.join(", ")}
            </p>
            <p className="mb-3">
              <span className="text-blue-400">FR:</span> {kanji.meaningFr?.join(", ")}
            </p>
          </div>

          <div>
            <Heading level="2" className="mb-2">Lecture</Heading>
            {kanji.onyomi?.length > 0 && (
              <p className="mb-2">
                <span className="text-red-400">ON:</span> {kanji.onyomi.join(", ")}
              </p>
            )}
            {kanji.kunyomi?.length > 0 && (
              <p className="mb-2">
                <span>KUN:</span> {kanji.kunyomi.join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1"><span className="text-gray-400">Traits:</span> {kanji.strokeCount || "—"}</p>
          {kanji.radical && <p className="mb-1"><span className="text-gray-400">Radical:</span> {kanji.radical}</p>}
        </div>

        {kanji.words && kanji.words.length > 0 && (
          <div className="mt-8">
            <Heading level="2" className="mb-4">Mots contenant ce kanji</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kanji.words.slice(0, 20).map((word) => {
                const mainKanji = word.kanjis[0]?.text || "";
                const reading = word.kanas.map(k => k.text).join(", ");
                
                return (
                  <Link key={word.id} href={`/word/${encodeURIComponent(mainKanji)}`} className="bg-blue-900 hover:bg-blue-800 rounded p-3 transition-colors flex items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{mainKanji}</span>
                        <span className="text-sm">{reading}</span>
                        {word.common && (
                          <span className="ml-2 px-1 text-xs bg-red-500 rounded">commun</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {kanji.words.length > 20 && (
              <div className="mt-3 text-center text-blue-400">
                + {kanji.words.length - 20} autres mots
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}