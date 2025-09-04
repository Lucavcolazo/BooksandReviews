import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id: string; // ID único para compatibilidad con el frontend
  email: string;
  username: string;
  displayName: string;
  password: string; // Contraseña hasheada
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  emailVerified: boolean; // Para futuras funcionalidades de verificación
  lastLogin?: string; // Último inicio de sesión
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      newReviews: boolean;
      likes: boolean;
    };
  };
  stats: {
    totalReviews: number;
    totalLikes: number;
    totalDislikes: number;
    booksRead: number;
    booksFavorited: number;
  };
}

export interface CreateUserData {
  email: string;
  username: string;
  displayName: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserData {
  displayName?: string;
  avatar?: string;
  bio?: string;
  preferences?: Partial<User['preferences']>;
}

export interface UserStats {
  totalReviews: number;
  totalLikes: number;
  totalDislikes: number;
  booksRead: number;
  booksFavorited: number;
}
