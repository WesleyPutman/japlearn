"use client";
import { useState, useEffect, useRef } from 'react';
import * as wanakana from 'wanakana';
import Button from '@/components/Button';

export default function ReadingExercise({ exercise, onAnswer }) {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Bind WanaKana pour la conversion automatique
    if (inputRef.current) {
      wanakana.bind(inputRef.current);
    }
    
    return () => {
      if (inputRef.current) {
        wanakana.unbind(inputRef.current);
      }
    };
  }, []);
  
  const checkAnswer = () => {
    const normalizedInput = userInput.trim().toLowerCase();
    const correctAnswers = exercise.correctAnswers.map(answer => 
      answer.toLowerCase()
    );
    
    const isCorrect = correctAnswers.some(answer => {
      // Vérifier correspondance exacte
      if (answer === normalizedInput) return true;
      
      // Vérifier correspondance en romaji->hiragana
      const romajiConverted = wanakana.toHiragana(normalizedInput);
      if (answer === romajiConverted) return true;
      
      return false;
    });
    
    setIsAnswered(true);
    
    if (isCorrect) {
      setFeedback({ 
        type: 'success', 
        message: 'Correct ! 🎉' 
      });
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. Les bonnes réponses: ${exercise.correctAnswers.join(', ')}` 
      });
    }
    
    setTimeout(() => {
      onAnswer(normalizedInput, isCorrect);
    }, 2000);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() && !isAnswered) {
      checkAnswer();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
        <div className="text-8xl font-bold mb-4 text-blue-600">
          {exercise.character}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Tape en romaji, cela se convertira automatiquement
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Exemple: sora ou そら"
            className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isAnswered}
            autoFocus
          />
        </div>
        
        {feedback && (
          <div className={`mb-4 p-3 rounded-md text-center ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }`}>
            {feedback.message}
          </div>
        )}
        
        <div className="text-center">
          <Button 
            type="submit" 
            disabled={!userInput.trim() || isAnswered}
            className="px-8 py-3"
          >
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}