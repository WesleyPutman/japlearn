"use client";
import dynamic from 'next/dynamic';

// Import dynamique des composants d'exercice
const TracingExercise = dynamic(() => import('./exercises/TracingExercise'));
const CompletionExercise = dynamic(() => import('./exercises/CompletionExercise'));
const ReadingExercise = dynamic(() => import('./exercises/ReadingExercise'));
const MeaningExercise = dynamic(() => import('./exercises/MeaningExercise'));
const ReverseExercise = dynamic(() => import('./exercises/ReverseExercise'));

export default function ExerciseRenderer({ exercise, onAnswer, data, type }) {
  const commonProps = {
    exercise,
    onAnswer,
    data,
    type
  };
  
  switch (exercise.type) {
    case 'tracing':
      return <TracingExercise {...commonProps} />;
      
    case 'completion':
      return <CompletionExercise {...commonProps} />;
      
    case 'reading':
      return <ReadingExercise {...commonProps} />;
      
    case 'meaning':
      return <MeaningExercise {...commonProps} />;
      
    case 'reverse':
      return <ReverseExercise {...commonProps} />;
      
    default:
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Type d'exercice non reconnu: {exercise.type}</p>
        </div>
      );
  }
}