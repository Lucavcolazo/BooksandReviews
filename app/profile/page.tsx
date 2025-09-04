import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import { getAllReviews } from '@/app/actions/reviews';
import { getUserBookLists } from '@/app/actions/booklists';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    redirect('/auth/login');
  }

  const user = currentUser.user;
  
  // Obtener datos del usuario
  const [reviews, bookLists] = await Promise.all([
    getAllReviews().then(reviews => reviews.filter(review => review.userId === user.id)),
    getUserBookLists(user.id)
  ]);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-amber-200"
              />
            ) : (
              <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center border-4 border-amber-300">
                <span className="text-amber-800 font-bold text-3xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{user.displayName}</h1>
              <p className="text-amber-200 text-lg">@{user.username}</p>
              {user.bio && (
                <p className="text-amber-200 mt-2">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center border border-amber-200">
            <div className="text-3xl font-bold text-amber-900 mb-2">{user.stats.totalReviews}</div>
            <div className="text-amber-700">Reseñas</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border border-amber-200">
            <div className="text-3xl font-bold text-amber-900 mb-2">{user.stats.booksRead}</div>
            <div className="text-amber-700">Libros Leídos</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border border-amber-200">
            <div className="text-3xl font-bold text-amber-900 mb-2">{user.stats.totalLikes}</div>
            <div className="text-amber-700">Likes Recibidos</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border border-amber-200">
            <div className="text-3xl font-bold text-amber-900 mb-2">{bookLists.length}</div>
            <div className="text-amber-700">Listas</div>
          </div>
        </div>

        {/* Reseñas Recientes */}
        <div className="bg-white rounded-lg border border-amber-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Reseñas Recientes</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-amber-100 pb-4 last:border-b-0">
                  <div className="flex items-start gap-4">
                    {review.bookThumbnail && (
                      <img 
                        src={review.bookThumbnail} 
                        alt={review.bookTitle}
                        className="w-12 h-16 object-cover rounded border border-amber-200"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">{review.bookTitle}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-amber-500 font-semibold">{review.rating}★</div>
                        <span className="text-amber-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-amber-800 text-sm line-clamp-2">{review.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-700 text-center py-8">Aún no has escrito reseñas</p>
          )}
        </div>

        {/* Listas de Libros */}
        <div className="bg-white rounded-lg border border-amber-200 p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Mis Listas</h2>
          {bookLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookLists.map((list) => (
                <div key={list.id} className="border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">{list.name}</h3>
                  <p className="text-amber-700 text-sm mb-2">{list.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 text-sm">{list.bookCount} libros</span>
                    <span className="text-amber-600 text-sm capitalize">{list.type}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-700 text-center py-8">Aún no has creado listas</p>
          )}
        </div>
      </main>
    </div>
  );
}
