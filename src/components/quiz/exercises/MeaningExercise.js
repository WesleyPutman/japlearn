"use client";
import { useState } from 'react';
import Button from '@/components/Button';

export default function MeaningExercise({ exercise, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Préparer les options (1 bonne réponse + distracteurs)
  const correctAnswer = exercise.correctAnswers[0];
  const options = [correctAnswer, ...exercise.distractors]
    .sort(() => Math.random() - 0.5); // Mélanger
  
  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isCorrect = exercise.correctAnswers.includes(option);
    
    if (isCorrect) {
      setFeedback({ 
        type: 'success', 
        message: 'Parfait ! 🎉' 
      });
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. La bonne réponse était: ${correctAnswer}` 
      });
    }
    
    setTimeout(() => {
      onAnswer(option, isCorrect);
    }, 2000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
        <div className="text-8xl font-bold mb-4 text-blue-600">
          {exercise.character}
        </div>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="grid gap-3">
          {options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border rounded-lg transition-colors ";
            
            if (isAnswered) {
              if (exercise.correctAnswers.includes(option)) {
                buttonClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-200";
              } else if (selectedAnswer === option) {
                buttonClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-200";
              } else {
                buttonClass += "bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400";
              }
            } else {
              buttonClass += "border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/20";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={buttonClass}
                disabled={isAnswered}
              >
                <span className="text-lg font-medium">{option}</span>
              </button>
            );
          })}
        </div>
        
        {feedback && (
          <div className={`mt-6 p-4 rounded-md text-center ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}