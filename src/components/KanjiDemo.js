"use client"

import useHanziWrite from "@/hooks/useHanziWrite";

export default function KanjiDemo({ character }) {
  const { containerRef, isLoading } = useHanziWrite(character, {
    width: 120,
    height: 120,
    padding: 5,
    strokeAnimationSpeed: 1.5,
    strokeWidth: 6,
    drawingWidth: 30,
    strokeColor: '#FFFFFF',
    outlineColor: '#DF6060',
  });

  return (
    <div className="bg-blue-900 rounded-md p-1 flex items-center justify-center">
      <div className="w-[120px] h-[120px] relative">
        <div ref={containerRef} className="w-full h-full absolute top-0 left-0"></div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/70 rounded">
            <p className="text-xs">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}