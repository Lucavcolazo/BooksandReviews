'use client'

import { useState, useEffect } from 'react';
import Toast from './Toast';
import { createReview, getReviewByBookId, getAllReviews, incrementLikes, incrementDislikes } from '../actions/reviews';
import { addToFavorites, removeFromFavorites, isBookInFavorites } from '../actions/booklists';
import { useAuth } from '@/lib/auth-context';

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  language?: string;
}

interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  isEdited: boolean;
  isPublic: boolean;
  stats: {
    likes: number;
    dislikes: number;
    helpful: number;
    reports: number;
  };
  tags?: string[];
  spoilerWarning?: boolean;
}

export default function BookModal() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [otherReviews, setOtherReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    const handleBookClick = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const bookId = customEvent.detail;
      console.log('BookModal: Recibido evento openBookModal con bookId:', bookId);
      
      setLoading(true);
      setIsOpen(true);
      setShowReviewForm(true);
      setUserReview(null);
      
      try {
        console.log('BookModal: Haciendo fetch a /api/books/', bookId);
        const response = await fetch(`/api/books/${encodeURIComponent(bookId)}`);
        console.log('BookModal: Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('BookModal: Error response:', errorText);
          throw new Error(`Error al cargar el libro: ${response.status}`);
        }
        
        const bookData = await response.json();
        console.log('BookModal: Datos del libro recibidos:', bookData);
        setBook(bookData);
        
        // Verificar si ya existe una reseña para este libro del usuario actual
        try {
          const existingReview = user ? await getReviewByBookId(bookId, user.id) : null;
          if (existingReview) {
            setUserReview(existingReview);
            setShowReviewForm(false);
          }
        } catch (error) {
          console.error('Error loading existing review:', error);
        }

        // Cargar reseñas de otros usuarios para este libro
        try {
          const allReviews = await getAllReviews();
          const bookReviews = allReviews.filter(review => {
            // Solo incluir reseñas del libro actual
            if (review.bookId !== bookId) return false;
            
            // Si hay usuario autenticado, excluir su reseña
            if (user && review.userId === user.id) {
              return false;
            }
            
            return true;
          });
          
          setOtherReviews(bookReviews);
        } catch (error) {
          console.error('Error loading other reviews:', error);
        }

        // Verificar si el libro está en favoritos (solo si el usuario está autenticado)
        if (isAuthenticated && user) {
          try {
            const inFavorites = await isBookInFavorites(user.id, bookId);
            setIsInFavorites(inFavorites);
          } catch (error) {
            console.error('Error checking favorites:', error);
          }
        }
      } catch (error) {
        console.error('BookModal: Error loading book:', error);
        setToastMessage(`Error al cargar la información del libro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('openBookModal', handleBookClick);
    return () => {
      window.removeEventListener('openBookModal', handleBookClick);
    };
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !rating || !review.trim()) return;

    try {
      // Verificar autenticación
      if (!isAuthenticated || !user) {
        setToastMessage('Debes iniciar sesión para escribir reseñas');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // Crear reseña usando Server Action
      const newReview = await createReview({
        bookId: book.id,
        bookTitle: book.title,
        bookThumbnail: book.thumbnail,
        rating,
        content: review.trim(),
        userId: user.id,
        userDisplayName: user.displayName,
        userAvatar: user.avatar
      });

      // Disparar evento personalizado para notificar que se agregó una nueva reseña
      const event = new CustomEvent('reviewAdded', { detail: newReview });
      window.dispatchEvent(event);

      // Mostrar toast de éxito
      setToastMessage('¡Reseña publicada con éxito!');
      setToastType('success');
      setShowToast(true);

      // Mostrar la reseña publicada
      setUserReview(newReview);
      setShowReviewForm(false);
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error creating review:', error);
      setToastMessage('Error al publicar la reseña');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleEditReview = () => {
    setShowReviewForm(true);
    setUserReview(null);
    setRating(0);
    setReview('');
  };

  const handleToggleFavorites = async () => {
    if (!book || !user || favoritesLoading) return;

    setFavoritesLoading(true);
    try {
      let result;
      
      if (isInFavorites) {
        // Remover de favoritos
        result = await removeFromFavorites(user.id, book.id);
      } else {
        // Agregar a favoritos
        result = await addToFavorites(user.id, {
          bookId: book.id,
          bookTitle: book.title,
          bookThumbnail: book.thumbnail,
          bookAuthors: book.authors || []
        });
      }

      if (result.success) {
        setIsInFavorites(!isInFavorites);
        setToastMessage(result.message);
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(result.message);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      setToastMessage('Error al actualizar favoritos');
      setToastType('error');
      setShowToast(true);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const updatedReview = await incrementLikes(reviewId);
      
      // Actualizar la reseña en el estado
      setOtherReviews(otherReviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  };

  const handleDislike = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const updatedReview = await incrementDislikes(reviewId);
      
      // Actualizar la reseña en el estado
      setOtherReviews(otherReviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
    } catch (error) {
      console.error('Error incrementing dislikes:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div role="dialog" className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
          {/* Header */}
          <div className="bg-slate-800 text-slate-100 p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-600 rounded mb-2"></div>
                    <div className="h-4 bg-slate-600 rounded w-2/3"></div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-2 text-slate-100">{book?.title}</h1>
                    <p className="text-slate-300">{book?.authors?.join(', ') || 'Autor Desconocido'}</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-slate-100 transition-colors"
                aria-label="close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex gap-6">
                  <div className="w-32 h-48 bg-slate-200 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : book ? (
              <>
                {/* Book Info */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} className="w-32 h-48 object-cover rounded border border-slate-200" />
                    ) : (
                      <div className="w-32 h-48 bg-slate-200 rounded flex items-center justify-center border border-slate-300">
                        <svg data-testid="book-placeholder" className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="text-sm text-slate-700">
                      <p><strong>Publicado:</strong> {book.publishedDate || 'N/D'}</p>
                      <p><strong>Páginas:</strong> {book.pageCount || 'N/D'}</p>
                      <p><strong>Editorial:</strong> {book.publisher || 'N/D'}</p>
                      <p><strong>Idioma:</strong> {book.language || 'N/D'}</p>
                      <p><strong>Categorías:</strong> {book.categories?.join(', ') || 'N/D'}</p>
                    </div>
                    
                    {/* Botón de Favoritos */}
                    {isAuthenticated && (
                      <div className="pt-3">
                        <button
                          onClick={handleToggleFavorites}
                          disabled={favoritesLoading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isInFavorites
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
                          } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {favoritesLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg 
                              className={`w-4 h-4 ${isInFavorites ? 'fill-current' : ''}`} 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                              />
                            </svg>
                          )}
                          <span className="text-sm font-medium">
                            {isInFavorites ? 'En Favoritos' : 'Agregar a Favoritos'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Descripción</h3>
                    <div className="text-slate-700 leading-relaxed max-h-32 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="whitespace-pre-wrap text-sm">
                        {book.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()}
                      </p>
                    </div>
                  </div>
                )}

                {/* User Review Section */}
                <div className="border-t border-slate-200 pt-6">
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Inicia sesión para reseñar</h3>
                      <p className="text-slate-600 mb-4">Necesitas una cuenta para escribir reseñas y calificar libros</p>
                      <a
                        href="/auth/login"
                        className="inline-block bg-slate-800 text-slate-100 px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Iniciar Sesión
                      </a>
                    </div>
                  ) : userReview ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Tu Reseña</h3>
                        <button
                          onClick={handleEditReview}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-yellow-500 font-semibold">{userReview.rating}★</div>
                          <span className="text-slate-600 text-sm">{new Date(userReview.createdAt).toLocaleDateString()}</span>
                          {userReview.isEdited && (
                            <span className="text-slate-500 text-xs">(editado)</span>
                          )}
                        </div>
                        <p className="text-slate-700">{userReview.content}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Deja tu reseña</h3>
                      
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Calificación</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-colors ${
                                  star <= rating ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Tu reseña</label>
                          <textarea 
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4} 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-800"
                            placeholder="Comparte tu opinión sobre este libro..."
                            required
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            type="submit" 
                            className="bg-slate-800 text-slate-100 px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                          >
                            Publicar Reseña
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsOpen(false)}
                            className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Cerrar
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* Other Reviews Section */}
                {otherReviews.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Reseñas de otros usuarios</h3>
                    <div className="space-y-4">
                      {otherReviews.map((review) => (
                        <div key={review.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-500 font-semibold">{review.rating}★</div>
                            <span className="text-slate-600 text-sm">por {review.userDisplayName}</span>
                            <span className="text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                            {review.isEdited && (
                              <span className="text-slate-500 text-xs">(editado)</span>
                            )}
                          </div>
                          <p className="text-slate-700 mb-3">{review.content}</p>
                          
                          {/* Like/Dislike buttons */}
                          {isAuthenticated && user && (
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(review.id)}
                                className="flex items-center gap-1 text-slate-600 hover:text-green-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 00-2 2v6a2 2 0 002 2h2.5M7 10h2.5M7 10V8a2 2 0 012-2h2.5M7 10l-2.5 5M17 10l2.5 5" />
                                </svg>
                                <span className="text-sm">{review.stats.likes}</span>
                              </button>
                              <button
                                onClick={() => handleDislike(review.id)}
                                className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10V6m7 8a2 2 0 002-2V6a2 2 0 00-2-2h-2.5M17 14h-2.5M17 14v2a2 2 0 01-2 2h-2.5M17 14l2.5-5M7 14l-2.5-5" />
                                </svg>
                                <span className="text-sm">{review.stats.dislikes}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-slate-700">
                <p>Error al cargar la información del libro</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
