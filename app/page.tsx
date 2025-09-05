import { searchBooks } from './actions/books';
import Link from 'next/link';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import MainMenu from './components/MainMenu';
import ExploreSection from './components/ExploreSection';
import LibrarySection from './components/LibrarySection';
import AuthButton from './components/AuthButton';
import BookChat from './components/BookChat';
import ChatButton from './components/ChatButton';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente y efecto de grano */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-6">
            {/* Logo/Título a la izquierda */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-100">Books and Reviews</h1>
              </div>
            </div>
            
            {/* Navigation centrada */}
            <nav className="flex gap-8">
              <Link 
                href="/" 
                className={`text-slate-100 text-sm font-medium transition-all duration-200 ${
                  currentView === 'menu' 
                    ? 'text-slate-100' 
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Inicio
              </Link>
              <Link 
                href="/?view=explore" 
                className={`text-slate-100 text-sm font-medium transition-all duration-200 ${
                  currentView === 'explore' 
                    ? 'text-slate-100' 
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Descubrir
              </Link>
              <Link 
                href="/?view=library" 
                className={`text-slate-100 text-sm font-medium transition-all duration-200 ${
                  currentView === 'library' 
                    ? 'text-slate-100' 
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Mi Biblioteca
              </Link>
            </nav>
            
            {/* Auth Button a la derecha */}
            <div className="flex items-center">
              <AuthButton />
            </div>
          </div>
          
          {/* Search Form - Only show when in search view */}
          {currentView === 'search' && (
            <div className="pb-8">
              <form action="/?view=search" className="max-w-2xl mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="q"
                    defaultValue={params?.q || ''}
                    placeholder="Buscar por título, autor o ISBN..."
                    className="flex-1 px-6 py-4 rounded-full text-slate-800 text-lg bg-slate-100/90 backdrop-blur-sm border border-slate-200/50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/50 shadow-lg"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 rounded-full transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-200/30"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden sm:inline">Buscar</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10">
        {currentView === 'menu' && <MainMenu />}
        
        {currentView === 'search' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
                               {!params?.q ? (
                     <div className="text-center text-slate-100">
                       <p className="text-xl">Ingresa un término de búsqueda para comenzar</p>
                     </div>
                   ) : results.length === 0 ? (
                     <div className="text-center text-slate-100">
                       <p className="text-xl">No se encontraron resultados :(</p>
                     </div>
                   ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {currentView === 'explore' && <ExploreSection />}
        {currentView === 'library' && <LibrarySection />}
      </main>
      
      {/* Chat Button - Fixed position */}
      <ChatButton />
      
      <BookModal />
    </div>
  );
}
