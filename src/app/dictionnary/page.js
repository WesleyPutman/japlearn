"use client";
import dynamic from "next/dynamic";

const Dictionary = dynamic(() => import('@/components/Dictionnary'), { ssr: false });
const Input = dynamic(() => import('@/components/Input'), { ssr: false });

export default function DictionnaryPage() {
  return (
      <Dictionary />
  );
}