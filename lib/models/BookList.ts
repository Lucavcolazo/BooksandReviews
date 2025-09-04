import { ObjectId } from 'mongodb';

export type ListType = 'favorites' | 'want-to-read' | 'currently-reading' | 'read' | 'custom';

export interface BookList {
  _id?: ObjectId;
  id: string; // ID único para compatibilidad con el frontend
  userId: string; // Propietario de la lista
  name: string; // Nombre de la lista
  description?: string; // Descripción de la lista
  type: ListType; // Tipo de lista
  isPublic: boolean; // Si la lista es pública
  isDefault: boolean; // Si es una lista por defecto del sistema
  createdAt: string;
  updatedAt: string;
  bookCount: number; // Número de libros en la lista
  books: BookListItem[]; // Libros en la lista
}

export interface BookListItem {
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  bookAuthors: string[];
  addedAt: string; // Cuándo se agregó a la lista
  notes?: string; // Notas personales del usuario
  rating?: number; // Calificación personal (si aplica)
  readDate?: string; // Fecha de lectura (para listas de "leídos")
  progress?: number; // Progreso de lectura (0-100)
}

export interface CreateBookListData {
  userId: string;
  name: string;
  description?: string;
  type: ListType;
  isPublic?: boolean;
}

export interface UpdateBookListData {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddBookToListData {
  bookId: string;
  bookTitle: string;
  bookThumbnail?: string;
  bookAuthors: string[];
  notes?: string;
  rating?: number;
  readDate?: string;
  progress?: number;
}

export interface UpdateBookInListData {
  notes?: string;
  rating?: number;
  readDate?: string;
  progress?: number;
}

export interface BookListFilters {
  userId?: string;
  type?: ListType;
  isPublic?: boolean;
  bookId?: string; // Para buscar listas que contengan un libro específico
}
