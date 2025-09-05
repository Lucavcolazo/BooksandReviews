import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import { getAllReviews } from '@/app/actions/reviews';
import CompactNavbar from '@/app/components/CompactNavbar';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    redirect('/auth/login');
  }

  const user = currentUser.user;
  
  // Obtener solo las reseñas del usuario actual
  const reviews = await getAllReviews().then(reviews => 
    reviews.filter(review => review.userId === user.id)
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <CompactNavbar title="Mi Perfil" />
      
      {/* Header del perfil */}
      <div className="bg-amber-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-4 border-amber-200"
              />
            ) : (
              <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center border-4 border-amber-300">
                <span className="text-amber-800 font-bold text-2xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
              <p className="text-amber-200 text-lg">@{user.username}</p>
              {user.bio && (
                <p className="text-amber-200 mt-2">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Mis Reseñas */}
        <div className="bg-white rounded-lg border border-amber-200 p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Mis Reseñas</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-amber-100 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    {review.bookThumbnail && (
                      <img 
                        src={review.bookThumbnail} 
                        alt={review.bookTitle}
                        className="w-16 h-24 object-cover rounded border border-amber-200"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 text-lg mb-2">{review.bookTitle}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-amber-500 font-semibold">{review.rating}★</div>
                        <span className="text-amber-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-amber-800 mb-3">{review.content}</p>
                      
                      {/* Estadísticas de la reseña */}
                      <div className="flex items-center gap-4 text-sm text-amber-600">
                        <span>👍 {review.stats.likes} likes</span>
                        <span>👎 {review.stats.dislikes} dislikes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg mb-4">Aún no has escrito reseñas</p>
              <a 
                href="/?view=search" 
                className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
              >
                Buscar libros para reseñar
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
