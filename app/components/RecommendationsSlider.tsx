'use client'

import { useState, useEffect } from 'react';
import { getRecommendedBooks } from '../actions/books';
import { getFavoriteCategories } from '../actions/booklists';
import { SimpleBook } from '../actions/books';

interface RecommendationsSliderProps {
  userId?: string;
}

export default function RecommendationsSlider({ userId }: RecommendationsSliderProps) {
  const [books, setBooks] = useState<SimpleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let categories: string[] = [];
      
      // Si hay un usuario, obtener sus categorías favoritas
      if (userId) {
        categories = await getFavoriteCategories(userId);
      }
      
      // Obtener libros recomendados
      const recommendedBooks = await getRecommendedBooks(categories, 12);
      setBooks(recommendedBooks);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Error al cargar las recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, books.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, books.length - 3)) % Math.max(1, books.length - 3));
  };

  const openBookModal = (bookId: string) => {
    const event = new CustomEvent('openBookModal', { detail: bookId });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl border border-slate-200/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Libros Recomendados</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="animate-pulse">
                <div className="w-full h-64 bg-slate-200/20 rounded-lg mb-3"></div>
                <div className="h-4 bg-slate-200/20 rounded mb-2"></div>
                <div className="h-3 bg-slate-200/20 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl border border-slate-200/20 p-8">
        <div className="text-center">
          <div className="bg-red-100/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Error al cargar recomendaciones</h3>
          <p className="text-slate-200 mb-4">{error}</p>
          <button
            onClick={loadRecommendations}
            className="bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-2 rounded-lg transition-colors backdrop-blur-sm border border-slate-200/30"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl border border-slate-200/20 p-8">
        <div className="text-center">
          <div className="bg-slate-100/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">No hay recomendaciones disponibles</h3>
          <p className="text-slate-200">Agrega algunos libros a favoritos para obtener recomendaciones personalizadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl border border-slate-200/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Libros Recomendados</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={books.length <= 4}
            className="p-2 rounded-full bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm border border-slate-200/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={books.length <= 4}
            className="p-2 rounded-full bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm border border-slate-200/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 208}px)` }}
        >
          {books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-48">
              <div className="bg-slate-100/10 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer border border-slate-200/20" onClick={() => openBookModal(book.id)}>
                {book.thumbnail ? (
                  <img 
                    src={book.thumbnail} 
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-100/20 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <h3 className="font-semibold text-slate-100 text-sm mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-slate-300 text-xs line-clamp-1">
                  {book.authors?.join(', ') || 'Autor Desconocido'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de página */}
      {books.length > 4 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(books.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-slate-100' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
