export function generateQuizExercises(data, type, options = {}) {
  const {
    includeTracing = true,
    includeReading = true,
    includeMeaning = true,
    includeReverse = true,
    includeCompletion = true,
    difficulty = 'medium'
  } = options;
  
  const exercises = [];
  
  if (type === 'kanji') {
    // Kanji Tracing
    if (includeTracing) {
      exercises.push({
        id: `tracing-${data.character}`,
        type: 'tracing',
        character: data.character,
        title: 'Trace le kanji complet',
        instructions: 'Écris le kanji en suivant l\'ordre des traits'
      });
    }
    
    // Completion Tracing
    if (includeCompletion) {
      exercises.push({
        id: `completion-${data.character}`,
        type: 'completion',
        character: data.character,
        title: 'Complète le kanji',
        instructions: 'Termine les traits manquants',
        completionRatio: 0.6 // Montrer 60% du kanji
      });
    }
    
    // Reading Quiz
    if (includeReading && (data.onyomi?.length > 0 || data.kunyomi?.length > 0)) {
      exercises.push({
        id: `reading-${data.character}`,
        type: 'reading',
        character: data.character,
        title: 'Quelle est la lecture de ce kanji ?',
        correctAnswers: [...(data.onyomi || []), ...(data.kunyomi || [])],
        inputType: 'text' // ou 'multiple-choice'
      });
    }
    
    // Meaning Quiz
    if (includeMeaning && (data.meaningEn?.length > 0 || data.meaningFr?.length > 0)) {
      exercises.push({
        id: `meaning-${data.character}`,
        type: 'meaning',
        character: data.character,
        title: 'Que signifie ce kanji ?',
        correctAnswers: [...(data.meaningEn || []), ...(data.meaningFr || [])],
        distractors: generateMeaningDistractors(data, 3)
      });
    }
    
    // Reverse Quiz
    if (includeReverse && data.meaningEn?.length > 0) {
      exercises.push({
        id: `reverse-${data.character}`,
        type: 'reverse',
        meaning: data.meaningEn[0],
        character: data.character,
        title: `Quel kanji signifie "${data.meaningEn[0]}" ?`,
        inputType: 'text'
      });
    }
  }
  
  // Mélanger les exercices
  return shuffleArray(exercises);
}

function generateMeaningDistractors(data, count) {
  // TODO: Implémenter la génération de distracteurs
  // Pour l'instant, des distracteurs génériques
  const genericDistractors = [
    'eau', 'feu', 'terre', 'vent', 'montagne', 'rivière',
    'water', 'fire', 'earth', 'wind', 'mountain', 'river',
    'soleil', 'lune', 'étoile', 'nuage', 'pluie', 'neige'
  ];
  
  return genericDistractors
    .filter(d => !data.meaningEn?.includes(d) && !data.meaningFr?.includes(d))
    .slice(0, count);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}