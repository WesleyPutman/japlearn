"use client";
import { useState, useRef, useEffect } from 'react';
import * as wanakana from 'wanakana';
import Button from '@/components/Button';

export default function ReverseExercise({ exercise, onAnswer }) {
  const [userInput, setUserInput] = useState('');
  const [kanjiSuggestions, setKanjiSuggestions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const inputRef = useRef(null);
  
  // Recherche dans la BDD des kanjis par lecture (kun/on)
  const searchKanjiByReading = async (reading) => {
    if (!reading || reading.length < 1) {
      setKanjiSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: reading,
          types: ['kanji'],
          filters: {
            byReading: true // Recherche par kun/on
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const kanjis = data.results?.kanjis || [];
        
        // Filtrer les kanjis qui ont cette lecture en kun ou on
        const matchingKanjis = kanjis.filter(kanji => {
          const kunReadings = kanji.kunyomi || [];
          const onReadings = kanji.onyomi || [];
          
          return kunReadings.some(kun => kun.includes(reading)) || 
                 onReadings.some(on => on.includes(reading));
        });
        
        setKanjiSuggestions(matchingKanjis.slice(0, 8));
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setKanjiSuggestions([]);
    }
  };
  
  useEffect(() => {
    // Configuration WanaKana sur l'input pour la conversion en temps réel
    if (inputRef.current) {
      wanakana.bind(inputRef.current);
      
      return () => {
        if (inputRef.current) {
          wanakana.unbind(inputRef.current);
        }
      };
    }
  }, []);
  
  useEffect(() => {
    // Debounce pour la recherche
    const debounceTimer = setTimeout(() => {
      const hiraganaText = wanakana.toHiragana(userInput);
      if (wanakana.isHiragana(hiraganaText) && hiraganaText.length > 0) {
        searchKanjiByReading(hiraganaText);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [userInput]);
  
  const handleInputChange = (e) => {
    if (!isAnswered) {
      setUserInput(e.target.value);
    }
  };
  
  const selectKanji = (kanji) => {
    setUserInput(kanji.character);
    setKanjiSuggestions([]);
    inputRef.current?.focus();
  };
  
  const checkAnswer = () => {
    const normalizedInput = userInput.trim();
    const isCorrect = normalizedInput === exercise.character;
    
    setIsAnswered(true);
    
    if (isCorrect) {
      setFeedback({ 
        type: 'success', 
        message: 'Correct ! 🎉' 
      });
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. La bonne réponse était: ${exercise.character}` 
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
        <div className="text-4xl font-bold mb-4 text-blue-600 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
          "{exercise.meaning}"
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Tape en romaji (converti automatiquement) ou sélectionne un kanji
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Tape en romaji... (ex: ka → か)"
            className="w-full px-4 py-3 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isAnswered}
            autoFocus
          />
        </div>
        
        {/* Suggestions de kanji */}
        {kanjiSuggestions.length > 0 && !isAnswered && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 text-center">
              Kanjis avec cette lecture :
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {kanjiSuggestions.map((kanji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectKanji(kanji)}
                  className="px-3 py-2 text-2xl bg-gray-100 hover:bg-blue-100 dark:bg-gray-600 dark:hover:bg-blue-600 rounded-lg transition-colors border border-gray-300 dark:border-gray-500 flex flex-col items-center"
                  title={`Kun: ${kanji.kunyomi?.join(', ') || 'Aucun'} | On: ${kanji.onyomi?.join(', ') || 'Aucun'}`}
                >
                  <span>{kanji.character}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {kanji.meaningEn?.slice(0, 2).join(', ') || kanji.meaningFr?.slice(0, 2).join(', ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
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