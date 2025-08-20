import Image from "next/image";
import dynamic from 'next/dynamic';

const Heading = dynamic(() => import("../components/Heading"));
const Icon = dynamic(() => import("../components/Icon"));
const Separator = dynamic(() => import("../components/Separator"));
const Resource = dynamic(() => import("../components/Resource"));

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center items-center space-x-6 py-4">
        <span className="flex justify-center items-center bg-red-600 min-w-25 min-h-25 rounded-full"><Icon name="profil"></Icon></span>
        <div className="">
          <Heading level="2" className="text-white mb-4">Accueil</Heading> 
          <p className="text-white text-[14px]">Bienvenue PUTMAN Wesley sur JapLearn, prêt pour une petite leçon ?</p>
        </div>
      </div>
      <Separator />
      <Heading level="2" className="text-white mb-4">Ressources</Heading>
      <Resource />
      <Separator />
      <Heading level="2" className="text-white mb-4">Liens externes</Heading>
    </div>
  );
}
