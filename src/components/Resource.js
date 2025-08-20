'use client'

import dynamic from "next/dynamic";
import Link from "next/link";

const Heading = dynamic(() => import("./Heading"));
const Icon = dynamic(() => import("./Icon"));

const RESOURCE_ITEMS = [
    { title: "Kanji", href: "/kanji", icon: "kanji" },
    { title: "Leçons", href: "/lessons", icon: "study" },
    { title: "Cartes", href: "/flashcards", icon: "flashcards" },
    { title: "Histoire", href: "/history", icon: "toriGate" },
];

const ResourceCard = ({title, href, icon}) => (
    <Link href={href} className="block">
        <div className="flex flex-col justify-center items-center p-10 bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
            <Icon name={icon} stroke="white" width="50" height="50" className="" />
            <Heading level="3" className="text-white text-center">{title}</Heading>
        </div>
    </Link>
)

const Resource = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {RESOURCE_ITEMS.map((item, index) => (
        <ResourceCard key={index} {...item}/>
      ))}
    </div>
  );
};

export default Resource;
