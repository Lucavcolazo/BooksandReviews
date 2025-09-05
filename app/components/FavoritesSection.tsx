'use client'

import { useState, useEffect } from 'react';
import { getOrCreateFavoritesList, removeFromFavorites } from '../actions/booklists';
import { BookList, BookListItem } from '@/lib/models/BookList';
import Toast from './Toast';

interface FavoritesSectionProps {
  userId: string;
}

export default function FavoritesSection({ userId }: FavoritesSectionProps) {
  const [favoritesList, setFavoritesList] = useState<BookList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [removingBookId, setRemovingBookId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await getOrCreateFavoritesList(userId);
      setFavoritesList(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setToastMessage('Error al cargar los favoritos');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (bookId: string) => {
    try {
      setRemovingBookId(bookId);
      const result = await removeFromFavorites(userId, bookId);
      
      if (result.success) {
        // Actualizar la lista local
        if (favoritesList) {
          const updatedBooks = favoritesList.books.filter(book => book.bookId !== bookId);
          setFavoritesList({
            ...favoritesList,
            books: updatedBooks,
            bookCount: updatedBooks.length
          });
        }
        
        setToastMessage(result.message);
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(result.message);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setToastMessage('Error al remover de favoritos');
      setToastType('error');
      setShowToast(true);
    } finally {
      setRemovingBookId(null);
    }
  };

  const openBookModal = (bookId: string) => {
    const event = new CustomEvent('openBookModal', { detail: bookId });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="bg-slate-100/10 backdrop-blur-sm rounded-lg border border-slate-200/30 p-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Mis Favoritos</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 h-24 bg-slate-200/20 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200/20 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200/20 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200/20 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-100/10 backdrop-blur-sm rounded-lg border border-slate-200/30 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Mis Favoritos</h2>
          <span className="text-sm text-slate-300 bg-slate-100/20 px-3 py-1 rounded-full">
            {favoritesList?.bookCount || 0} libros
          </span>
        </div>

        {!favoritesList || favoritesList.books.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-slate-100/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">No tienes favoritos aún</h3>
            <p className="text-slate-300 mb-4">Explora libros y agrega tus favoritos para verlos aquí</p>
            <a
              href="/"
              className="inline-block bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-2 rounded-lg transition-colors backdrop-blur-sm border border-slate-200/30"
            >
              Explorar Libros
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritesList.books.map((book: BookListItem) => (
              <div key={book.bookId} className="bg-slate-100/10 backdrop-blur-sm rounded-lg border border-slate-200/30 p-4 hover:bg-slate-100/20 transition-all">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {book.bookThumbnail ? (
                      <img 
                        src={book.bookThumbnail} 
                        alt={book.bookTitle}
                        className="w-16 h-24 object-cover rounded border border-slate-200/50"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-slate-100/20 rounded flex items-center justify-center border border-slate-200/50">
                        <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm leading-tight">
                      {book.bookTitle}
                    </h3>
                    <p className="text-slate-300 text-xs mt-1">
                      {book.bookAuthors.join(', ')}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      Agregado: {new Date(book.addedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="mt-3">
                      <button
                        onClick={() => handleRemoveFromFavorites(book.bookId)}
                        disabled={removingBookId === book.bookId}
                        className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {removingBookId === book.bookId ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Quitar'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
