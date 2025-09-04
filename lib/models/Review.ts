import { ObjectId } from 'mongodb';

export interface Review {
  _id?: ObjectId;
  id: string; // ID único para compatibilidad con el frontend
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string; // ID del usuario que escribió la reseña
  userDisplayName: string; // Nombre del usuario (para evitar joins)
  userAvatar?: string; // Avatar del usuario
  isEdited: boolean;
  isPublic: boolean;
  stats: {
    likes: number;
    dislikes: number;
    helpful: number; // Reseñas marcadas como útiles
    reports: number; // Reportes de contenido inapropiado
  };
  tags?: string[]; // Tags para categorizar la reseña
  spoilerWarning?: boolean; // Advertencia de spoilers
}

export interface CreateReviewData {
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  rating: number;
  content: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  tags?: string[];
  spoilerWarning?: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  content?: string;
  tags?: string[];
  spoilerWarning?: boolean;
  isPublic?: boolean;
}

export interface ReviewFilters {
  bookId?: string;
  userId?: string;
  rating?: number;
  tags?: string[];
  isPublic?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
