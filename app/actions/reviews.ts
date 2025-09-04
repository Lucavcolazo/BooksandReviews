'use server'

import { getDatabase } from '@/lib/mongodb';
import { Review, CreateReviewData, UpdateReviewData, ReviewFilters } from '@/lib/models/Review';
import { ObjectId } from 'mongodb';

// Crear una nueva reseña
export async function createReview(data: CreateReviewData): Promise<Review> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const newReview: Omit<Review, '_id'> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      bookId: data.bookId,
      bookTitle: data.bookTitle,
      bookThumbnail: data.bookThumbnail,
      rating: data.rating,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: data.userId,
      userDisplayName: data.userDisplayName,
      userAvatar: data.userAvatar,
      isEdited: false,
      isPublic: true,
      stats: {
        likes: 0,
        dislikes: 0,
        helpful: 0,
        reports: 0
      },
      tags: data.tags || [],
      spoilerWarning: data.spoilerWarning || false
    };

    const result = await reviewsCollection.insertOne(newReview as Review);
    
    if (!result.insertedId) {
      throw new Error('Error al crear la reseña');
    }

    return { ...newReview, _id: result.insertedId } as Review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Error al crear la reseña');
  }
}

// Obtener todas las reseñas
export async function getAllReviews(): Promise<Review[]> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const reviews = await reviewsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Error al obtener las reseñas');
  }
}

// Obtener reseña por ID del libro
export async function getReviewByBookId(bookId: string): Promise<Review | null> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const review = await reviewsCollection.findOne({ bookId });
    return review;
  } catch (error) {
    console.error('Error fetching review by book ID:', error);
    throw new Error('Error al obtener la reseña');
  }
}

// Actualizar una reseña
export async function updateReview(reviewId: string, data: UpdateReviewData): Promise<Review> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const updateData: Partial<Review> = {
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.spoilerWarning !== undefined) updateData.spoilerWarning = data.spoilerWarning;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    const result = await reviewsCollection.findOneAndUpdate(
      { id: reviewId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Reseña no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Error al actualizar la reseña');
  }
}

// Eliminar una reseña
export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const result = await reviewsCollection.deleteOne({ id: reviewId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Error al eliminar la reseña');
  }
}

// Incrementar likes
export async function incrementLikes(reviewId: string): Promise<Review> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const result = await reviewsCollection.findOneAndUpdate(
      { id: reviewId },
      { $inc: { 'stats.likes': 1 } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Reseña no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error incrementing likes:', error);
    throw new Error('Error al actualizar los likes');
  }
}

// Incrementar dislikes
export async function incrementDislikes(reviewId: string): Promise<Review> {
  try {
    const db = await getDatabase();
    const reviewsCollection = db.collection<Review>('reviews');
    
    const result = await reviewsCollection.findOneAndUpdate(
      { id: reviewId },
      { $inc: { 'stats.dislikes': 1 } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Reseña no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error incrementing dislikes:', error);
    throw new Error('Error al actualizar los dislikes');
  }
}
