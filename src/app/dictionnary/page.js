"use client";
import dynamic from "next/dynamic";

const Dictionary = dynamic(() => import('@/components/Dictionnary'), { ssr: false });

export default function DictionnaryPage() {
  return (
    <main className="p-4">
      <Dictionary />
    </main>
  );
}