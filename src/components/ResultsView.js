import dynamic from "next/dynamic";
const Button = dynamic(() => import('@/components/Button'), { ssr: false });

export default function ResultsView({ items = [], renderItem, loading = false, page = 1, totalPages = 1, setPage, loadingMessage = "Chargement...", emptyMessage = "Aucun résultat trouvé", className = ""
}) {
  if (loading) {
    return <div className={`py-4 text-center ${className}`}>{loadingMessage}</div>;
  }

  if (!items.length) {
    return <div className={`py-4 text-center ${className}`}>{emptyMessage}</div>;
  }

  return (
    <div className={`w-full ${className}`}>
      <ul className="w-full">
        {items.map((item, index) => renderItem(item, index))}
      </ul>
      
      <div className="flex items-center justify-between mt-4">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="default">Précédent</Button>
        <span>Page {page} / {totalPages}</span>
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="secondary">Suivant</Button>
      </div>
    </div>
  );
}