"use client";
import { useState, useMemo } from 'react';
import { generateQuizExercises } from '@/lib/quiz/exerciseGenerator';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import ExerciseRenderer from './ExerciseRenderer';

export default function QuizContainer({ data, type }) {
  const exercises = useMemo(() => generateQuizExercises(data, type), [data, type]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentExercise = exercises[currentIndex];
  
  const handleAnswer = (answer, isCorrect) => {
    const newAnswer = {
      exerciseIndex: currentIndex,
      exercise: currentExercise,
      userAnswer: answer,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setUserAnswers(prev => [...prev, newAnswer]);
    
    // Passer au prochain exercice après un délai
    setTimeout(() => {
      if (currentIndex + 1 >= exercises.length) {
        setIsComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1500);
  };
  
  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsComplete(false);
  };
  
  if (isComplete) {
    return (
      <QuizResults 
        answers={userAnswers}
        exercises={exercises}
        onRestart={handleRestart}
        data={data}
        type={type}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <QuizProgress 
        current={currentIndex + 1}
        total={exercises.length}
        percentage={((currentIndex + 1) / exercises.length) * 100}
      />
      
      <div className="mt-8">
        <ExerciseRenderer
          exercise={currentExercise}
          onAnswer={handleAnswer}
          data={data}
          type={type}
        />
      </div>
    </div>
  );
}