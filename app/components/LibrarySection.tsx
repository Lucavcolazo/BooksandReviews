import Link from 'next/link';
import { getCurrentUser } from '../actions/auth';
import { getAllReviews } from '../actions/reviews';
import { getOrCreateFavoritesList } from '../actions/booklists';
import FavoritesSection from './FavoritesSection';
import ReviewsSection from './ReviewsSection';

export default async function LibrarySection() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-slate-200/20">
            <div className="w-16 h-16 bg-slate-100/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">Inicia sesión para acceder a tu biblioteca</h3>
            <p className="text-slate-200 mb-6">
              Crea una cuenta o inicia sesión para ver tus reseñas y libros guardados
            </p>
            <a 
              href="/auth/login" 
              className="inline-block bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-3 rounded-full transition-colors backdrop-blur-sm border border-slate-200/30"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  const user = currentUser.user;
  
  // Obtener reseñas del usuario
  const allReviews = await getAllReviews();
  const userReviews = allReviews.filter(review => review.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 font-space-grotesk">
            Mi Biblioteca
          </h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Tu colección personal de reseñas y libros favoritos
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Favorites Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-100">Libros Favoritos</h3>
            <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/20">
              <FavoritesSection userId={user.id} />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-100">Mis Reseñas</h3>
            <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/20">
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-slate-100/5 rounded-lg p-4 border border-slate-200/10">
                      <div className="flex items-start gap-3">
                        {review.bookThumbnail && (
                          <img 
                            src={review.bookThumbnail} 
                            alt={review.bookTitle}
                            className="w-12 h-16 object-cover rounded border border-slate-200/20"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-100 text-sm mb-1 line-clamp-1">
                            {review.bookTitle}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-400 font-semibold text-sm">{review.rating}★</div>
                            <span className="text-slate-300 text-xs">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-200 text-xs line-clamp-2">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userReviews.length > 5 && (
                    <div className="text-center pt-4">
                      <a 
                        href="/profile" 
                        className="text-slate-300 hover:text-slate-100 text-sm transition-colors"
                      >
                        Ver todas las {userReviews.length} reseñas →
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-slate-200 text-sm mb-4">Aún no hay reseñas</p>
                  <Link 
                    href="/?view=search" 
                    className="inline-block bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-4 py-2 rounded-full text-sm transition-colors backdrop-blur-sm border border-slate-200/30"
                  >
                    Comenzar a Reseñar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
