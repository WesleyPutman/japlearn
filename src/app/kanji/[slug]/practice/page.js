"use client";
import {use} from "react";
import dynamic from "next/dynamic";
import useHanziWrite from "@/hooks/useHanziWrite";

const Button = dynamic(() => import('@/components/Button'));
const Heading = dynamic(() => import('@/components/Heading'));
const Separator = dynamic(() => import('@/components/Separator'));

export default function PracticePage({params}) {
   
    const unwrappedParams = use(params);
    const kanjiChar = decodeURIComponent(unwrappedParams.slug);

    const { containerRef, isLoading, mode, handlePractice, handleReset, handleManualDemo } = useHanziWrite(kanjiChar, { width: 300, height: 300 });
    return (
        <div className="p-6 flex flex-col items-center">
            <div className="w-full max-w-[800px] flex gap-4 flex-col items-center">
                <Heading level="2" className="mb-4">S'entrainer à écrire le kanji 「{kanjiChar}」</Heading>
                <div className="bg-blue-900 rounded-lg w-[300px] h-[300px] relative">
                    <div ref={containerRef} className="w-[300px] h-[300px] absolute top-0 left-0"></div>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-70">
                            <p>Chargement...</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-4 w-full justify-between">
                    {mode !== 'demo' && <Button onClick={handleManualDemo} className="w-full">Démo</Button>}
                    {mode !== 'practice' && <Button onClick={handlePractice} className="w-full">S'entrainer</Button>}
                    {(mode === 'demo' || mode === 'practice') && <Button onClick={handleReset} className="w-full" variant="secondary">Réinitialiser</Button>}
                </div>
                <span className="w-full">
                    <Button href={`/kanji/${encodeURIComponent(kanjiChar)}`} className="w-full !text-lg p-2" variant="text">&larr; Retour au kanji</Button>
                </span>
            </div>
        </div>
        
    )
}