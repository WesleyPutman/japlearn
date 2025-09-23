"use client";
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';

export default function CompletionExercise({ exercise, onAnswer }) {
  const canvasRef = useRef(null);
  const writerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    let HanziWriter;
    let mounted = true;
    
    const loadHanziWriter = async () => {
      try {
        if (!mounted || !canvasRef.current || !exercise.character) return;
        
        // Nettoyer le canvas existant
        if (writerRef.current) {
          writerRef.current.cancelQuiz();
          writerRef.current = null;
        }
        
        canvasRef.current.innerHTML = '';
        
        const module = await import('hanzi-writer');
        HanziWriter = module.default || module;
        
        if (!mounted) return;
        
        writerRef.current = HanziWriter.create(canvasRef.current, exercise.character, {
          width: 300,
          height: 300,
          padding: 20,
          strokeColor: '#2563eb',
          radicalColor: '#dc2626',
          highlightColor: '#fbbf24',
          drawingColor: '#059669',
          showOutline: false, // ✅ Masquer le contour complet
          showCharacter: false, // ✅ Ne pas afficher le caractère complet
          onCorrectStroke: () => {
            console.log('Trait correct !');
          },
          onMistake: () => {
            console.log('Trait incorrect !');
            if (mounted) {
              setFeedback({ type: 'error', message: 'Trait incorrect. Regarde l\'indice !' });
            }
          },
          onComplete: () => {
            if (mounted) {
              setFeedback({ type: 'success', message: 'Excellent ! Kanji complété !' });
              setTimeout(() => {
                if (mounted) onAnswer(exercise.character, true);
              }, 1500);
            }
          },
          charDataLoader: (char) => {
            return fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data/${char}.json`)
              .then(res => res.json());
          }
        });
        
        // ✅ Mode difficile : pas d'indice visuel permanent
        setTimeout(() => {
          if (mounted && writerRef.current) {
            // Démarrer directement le quiz sans montrer le caractère
            writerRef.current.quiz({
              strokeHighlightSpeed: 0.2,
              highlightOnComplete: true,
              showHintAfterMisses: 3, // Indice seulement après 3 erreurs
              highlightColor: '#fbbf24'
            });
            setIsLoaded(true);
          }
        }, 500);
        
      } catch (error) {
        console.error('Erreur lors du chargement de Hanzi Writer:', error);
        if (mounted) {
          setFeedback({ type: 'error', message: 'Erreur de chargement. Réessayez.' });
        }
      }
    };
    
    loadHanziWriter();
    
    return () => {
      mounted = false;
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
        writerRef.current = null;
      }
    };
  }, [exercise.character]);
  
  const handleReset = () => {
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      setTimeout(() => {
        if (writerRef.current) {
          writerRef.current.quiz({
            strokeHighlightSpeed: 0.2,
            highlightOnComplete: true,
            showHintAfterMisses: 3
          });
          setFeedback(null);
        }
      }, 100);
    }
  };
  
  const handleShowHint = () => {
    if (writerRef.current) {
      // Montrer un trait à la fois comme indice
      writerRef.current.showHint();
    }
  };
  
  const handleShowDemo = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };
  
  const handleSkip = () => {
    onAnswer('skipped', false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{exercise.instructions}</p>
        <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
          ⚡ Mode difficile : pas d'indice visuel ! Écris de mémoire.
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
          <div 
            ref={canvasRef} 
            className="border border-gray-300 dark:border-gray-600 rounded"
            style={{ width: '300px', height: '300px' }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">Chargement...</div>
            </div>
          )}
        </div>
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
      
      <div className="flex justify-center gap-4">
        <Button onClick={handleShowHint} variant="secondary">
          💡 Indice
        </Button>
        <Button onClick={handleShowDemo} variant="secondary">
          Voir démo
        </Button>
        <Button onClick={handleReset} variant="secondary">
          Recommencer
        </Button>
        <Button onClick={handleSkip} variant="outline">
          Passer
        </Button>
      </div>
    </div>
  );
}