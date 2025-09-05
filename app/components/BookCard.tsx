'use client'

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

export default function BookCard({ book }: { book: Book }) {
  const handleMoreInfo = () => {
    console.log('BookCard: Disparando evento openBookModal con bookId:', book.id);
    const event = new CustomEvent('openBookModal', { detail: book.id });
    window.dispatchEvent(event);
  };

  return (
    <div 
      role="article" 
      className="bg-slate-100/10 backdrop-blur-sm border border-slate-200/20 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-slate-100/15 hover:border-slate-200/30 group cursor-pointer"
      onClick={handleMoreInfo}
    >
      {book.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.thumbnail} alt={book.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-64 bg-slate-100/10 flex items-center justify-center">
          <svg data-testid="placeholder-icon" className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-100 text-lg mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-slate-300 text-sm line-clamp-1">
          {book.authors?.join(', ') || 'Autor Desconocido'}
        </p>
      </div>
    </div>
  );
}
