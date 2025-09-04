// Script de migración para transferir reseñas de localStorage a MongoDB
// Este archivo es solo para desarrollo y testing

import { createReview } from '@/app/actions/reviews';

export function migrateReviewsFromLocalStorage() {
  if (typeof window === 'undefined') {
    console.log('Este script solo funciona en el cliente');
    return;
  }

  const savedReviews = localStorage.getItem('book_reviews_v1');
  if (!savedReviews) {
    console.log('No hay reseñas en localStorage para migrar');
    return;
  }

  try {
    const reviews = JSON.parse(savedReviews);
    console.log(`Encontradas ${reviews.length} reseñas en localStorage`);
    
    // Migrar cada reseña
    reviews.forEach(async (review: any) => {
      try {
        await createReview({
          bookId: review.bookId,
          bookTitle: review.bookTitle,
          bookThumbnail: review.bookThumbnail,
          rating: review.rating,
          content: review.content,
          userId: 'anonymous-user',
          userDisplayName: 'Usuario Anónimo',
          userAvatar: undefined
        });
        console.log(`Migrada reseña: ${review.bookTitle}`);
      } catch (error) {
        console.error(`Error migrando reseña ${review.bookTitle}:`, error);
      }
    });

    // Opcional: limpiar localStorage después de la migración
    // localStorage.removeItem('book_reviews_v1');
    console.log('Migración completada');
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
}

// Función para ejecutar la migración desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).migrateReviews = migrateReviewsFromLocalStorage;
}
