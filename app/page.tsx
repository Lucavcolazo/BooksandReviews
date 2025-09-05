import { searchBooks } from './actions/books';
import Link from 'next/link';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import MainMenu from './components/MainMenu';
import ReviewsSection from './components/ReviewsSection';
import AuthButton from './components/AuthButton';

async function getData(q: string | undefined) {
  const query = q?.trim() || '';
  if (!query) return [];
  return await searchBooks(query);
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const params = await searchParams;
  const results = await getData(params?.q);
  const hasResults = params?.q && results.length > 0;
  // Si hay una búsqueda activa, mantener la vista en 'search'
  const currentView = params?.q ? 'search' : (params?.view || 'menu');

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className={`bg-amber-900 text-white transition-all duration-500 ${hasResults ? 'py-4' : 'py-16'}`}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Top Bar with Auth */}
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <h1 className="text-4xl font-bold">Books & Reviews</h1>
            <AuthButton />
          </div>
          
          {/* Navigation */}
          <nav className="flex justify-center gap-4 mb-8">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'menu' ? 'bg-amber-700 text-white' : 'text-amber-200 hover:text-white'}`}
            >
              Inicio
            </Link>
            <Link 
              href="/?view=search" 
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'search' ? 'bg-amber-700 text-white' : 'text-amber-200 hover:text-white'}`}
            >
              Buscar
            </Link>
            <Link 
              href="/?view=reviews" 
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'reviews' ? 'bg-amber-700 text-white' : 'text-amber-200 hover:text-white'}`}
            >
              Mis Reseñas
            </Link>
          </nav>
          
          {/* Search Form - Only show when in search view */}
          {currentView === 'search' && (
            <form action="/?view=search" className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={params?.q || ''}
                  placeholder="Busca por título, autor o ISBN..."
                  className="flex-1 px-6 py-4 rounded-lg text-white text-lg bg-amber-800/30 border-2 border-amber-200 placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200"
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Buscar</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'menu' && <MainMenu />}
        
        {currentView === 'search' && (
          <>
            {!params?.q ? (
              <div className="text-center text-amber-800">
                <p className="text-xl">Ingresa un término de búsqueda para comenzar</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-amber-800">
                <p className="text-xl">No se encontraron resultados :(</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
        
        {currentView === 'reviews' && <ReviewsSection />}
      </main>
      
      <BookModal />
    </div>
  );
}
