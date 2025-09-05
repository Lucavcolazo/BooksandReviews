'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { logoutUser } from '@/app/actions/auth';
import CompactNavbar from './CompactNavbar';
import FavoritesSection from './FavoritesSection';
import EditProfileModal from './EditProfileModal';
import Toast from './Toast';

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface Review {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  rating: number;
  content: string;
  createdAt: string;
  stats: {
    likes: number;
    dislikes: number;
  };
}

interface ProfileContentProps {
  user: User;
  reviews: Review[];
}

export default function ProfileContent({ user, reviews }: ProfileContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        logout();
        setToastMessage('Sesión cerrada exitosamente');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setToastMessage('Error al cerrar sesión');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error al cerrar sesión');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente y efecto de grano */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <CompactNavbar title="Mi Perfil" />
      
      {/* Header del perfil */}
      <div className="relative z-10 bg-slate-800/50 backdrop-blur-sm text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-4 border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-300">
                <span className="text-slate-800 font-bold text-2xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-slate-100">{user.displayName}</h1>
              <p className="text-slate-300 text-lg">@{user.username}</p>
              {user.bio && (
                <p className="text-slate-300 mt-2">{user.bio}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 rounded-lg transition-colors backdrop-blur-sm border border-slate-200/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors backdrop-blur-sm border border-red-500/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Mis Favoritos */}
        <FavoritesSection userId={user.id} />

        {/* Mis Reseñas */}
        <div className="bg-slate-100/10 backdrop-blur-sm rounded-lg border border-slate-200/30 p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Mis Reseñas</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-200/30 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    {review.bookThumbnail && (
                      <img 
                        src={review.bookThumbnail} 
                        alt={review.bookTitle}
                        className="w-16 h-24 object-cover rounded border border-slate-200/50"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 text-lg mb-2">{review.bookTitle}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-amber-400 font-semibold">{review.rating}★</div>
                        <span className="text-slate-300 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-200 mb-3">{review.content}</p>
                      
                      {/* Estadísticas de la reseña */}
                      <div className="flex items-center gap-4 text-sm text-slate-300">
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
              <p className="text-slate-300 text-lg mb-4">Aún no has escrito reseñas</p>
              <a 
                href="/?view=search" 
                className="inline-block bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-3 rounded-lg transition-colors backdrop-blur-sm border border-slate-200/30"
              >
                Buscar libros para reseñar
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Modal de edición */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
