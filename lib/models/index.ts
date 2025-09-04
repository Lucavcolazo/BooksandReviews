// Exportar todos los modelos y tipos
export * from './User';
export * from './Review';
export * from './Vote';
export * from './BookList';

// Tipos comunes
export type DatabaseCollection = 'users' | 'reviews' | 'votes' | 'booklists';

// Interfaces para operaciones comunes
export interface DatabaseOperation {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
