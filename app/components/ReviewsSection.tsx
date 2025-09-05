'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllReviews, incrementLikes, incrementDislikes } from '../actions/reviews';
import { useAuth } from '@/lib/auth-context';

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

export default function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const reviews = await getAllReviews();
      setReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  useEffect(() => {
    // Load reviews from MongoDB
    const initializeReviews = async () => {
      await loadReviews();
      setLoading(false);
    };
    
    initializeReviews();

    // Escuchar el evento de nueva reseña agregada
    const handleReviewAdded = () => {
      loadReviews();
    };

    window.addEventListener('reviewAdded', handleReviewAdded);
    
    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-amber-800">
        <p className="text-xl">Cargando reseñas...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-amber-800">
        <p className="text-xl mb-4">Aún no has escrito reseñas</p>
        <Link 
          href="/?view=search" 
          className="inline-block bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
        >
          Buscar libros para reseñar
        </Link>
      </div>
    );
  }

  const handleLike = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const updatedReview = await incrementLikes(reviewId);
      setReviews(reviews.map(review => 
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
      setReviews(reviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
    } catch (error) {
      console.error('Error incrementing dislikes:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Reseñas de la Comunidad</h2>
      <div className="grid gap-6">
        {reviews.map((review: Review) => {
          const isOwnReview = user && review.userId === user.id;
          
          return (
            <div key={review.id} className="bg-white border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                {review.bookThumbnail && (
                  <img 
                    src={review.bookThumbnail} 
                    alt={review.bookTitle} 
                    className="w-16 h-24 object-cover rounded border border-amber-200"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-amber-900">{review.bookTitle}</h3>
                    <span className="text-amber-600 text-sm">por {review.userDisplayName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-amber-500 font-semibold">{review.rating}★</div>
                    <span className="text-amber-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-amber-800 mb-4">{review.content}</p>
                  
                  {/* Like/Dislike buttons - solo para reseñas de otros usuarios */}
                  {!isOwnReview && user && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(review.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm font-medium">{review.stats.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => handleDislike(review.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                        </svg>
                        <span className="text-sm font-medium">{review.stats.dislikes}</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Solo mostrar estadísticas si no es tu reseña */}
                  {isOwnReview && (
                    <div className="flex items-center gap-4 text-sm text-amber-600">
                      <span>👍 {review.stats.likes} likes</span>
                      <span>👎 {review.stats.dislikes} dislikes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
