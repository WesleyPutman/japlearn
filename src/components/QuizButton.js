import Button from '@/components/Button';

export default function QuizButton({ slug, className = '' }) {
  return (
    <Button href={`/quiz/${encodeURIComponent(slug)}`} className={`${className}`}>
      Quiz
    </Button>
  );
}