import { getCurrentUser } from '../actions/auth';
import { getFavoriteCategories } from '../actions/booklists';
import { getRecommendedBooks } from '../actions/books';
import BookCard from './BookCard';

export default async function ExploreSection() {
  // Obtener información del usuario para recomendaciones personalizadas
  const currentUser = await getCurrentUser();
  const userId = currentUser.success ? currentUser.user?.id : undefined;
  
  let categories: string[] = [];
  let recommendedBooks: any[] = [];
  
  if (userId) {
    try {
      categories = await getFavoriteCategories(userId);
      recommendedBooks = await getRecommendedBooks(categories, 12);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 font-space-grotesk">
            Descubre Nuevos Libros
          </h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            {categories.length > 0 
              ? `Basado en tus géneros favoritos: ${categories.join(', ')}`
              : 'Explora libros populares y encuentra tu próxima lectura favorita'
            }
          </p>
        </div>

        {/* Books Grid */}
        {recommendedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-slate-200/20">
              <div className="w-16 h-16 bg-slate-100/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Aún no hay recomendaciones</h3>
              <p className="text-slate-200 mb-6">
                Agrega algunos libros a favoritos para obtener recomendaciones personalizadas
              </p>
              <a 
                href="/?view=search" 
                className="inline-block bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-3 rounded-full transition-colors backdrop-blur-sm border border-slate-200/30"
              >
                Comenzar a Explorar
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
