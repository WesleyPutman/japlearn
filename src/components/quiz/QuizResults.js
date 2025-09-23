
import Button from '@/components/Button';

export default function QuizResults({ answers, exercises, onRestart, data, type }) {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent ! 🎉';
    if (percentage >= 60) return 'Bien joué ! 👍';
    return 'Continue à t\'entraîner ! 💪';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz terminé !</h1>
        
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-xl mb-2">
            {correctAnswers} / {totalQuestions} bonnes réponses
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {getScoreMessage()}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Détails des réponses</h2>
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg flex justify-between items-center ${
                  answer.isCorrect 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                <span className="font-medium">
                  Question {index + 1}: {answer.exercise.title}
                </span>
                <span className={`text-sm ${
                  answer.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700">
            Recommencer le quiz
          </Button>
          <Button 
            href={`/${type}/${encodeURIComponent(type === 'kanji' ? data.character : data.slug || data.word)}`}
            variant="secondary"
          >
            Retour au {type === 'kanji' ? 'kanji' : 'mot'}
          </Button>
        </div>
      </div>
    </div>
  );
}