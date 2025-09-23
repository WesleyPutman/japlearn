import { notFound } from 'next/navigation';
import { getKanjiByCharacter } from '@/lib/services/kanji';
import { getWordBySlug } from '@/lib/services/word';
import QuizContainer from '@/components/quiz/QuizContainer';

export default async function QuizPage({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Tenter de récupérer en tant que kanji d'abord
  let data = await getKanjiByCharacter(decodedSlug);
  let type = 'kanji';
  
  // Si pas trouvé, essayer en tant que mot
  if (!data) {
    data = await getWordBySlug(decodedSlug);
    type = 'word';
  }
  
  if (!data) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <QuizContainer data={data} type={type} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  
  return {
    title: `Quiz - ${decodedSlug} | JapLearn`,
    description: `Pratique et mémorise ${decodedSlug} avec des exercices interactifs`,
  };
}