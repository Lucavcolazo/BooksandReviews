'use server'

export interface SimpleBook {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

export interface DetailedBook extends SimpleBook {
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  language?: string;
}

// Funciones de utilidad para mapeo de datos
function mapVolumeToSimple(volume: any): SimpleBook {
  const info = volume.volumeInfo || {};
  const imageLinks = info.imageLinks || {};
  return {
    id: volume.id,
    title: info.title || 'Título desconocido',
    authors: info.authors || [],
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || undefined,
  };
}

function mapVolumeToDetailed(volume: any): DetailedBook {
  const simple = mapVolumeToSimple(volume);
  const info = volume.volumeInfo || {};
  return {
    ...simple,
    description: info.description,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    categories: info.categories || [],
    publisher: info.publisher,
    language: info.language,
  };
}

export async function searchBooks(query: string): Promise<SimpleBook[]> {
  if (!query || query.trim().length === 0) return [];
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map(mapVolumeToSimple);
}

export async function getBookById(id: string): Promise<DetailedBook | null> {
  if (!id) return null;
  const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return mapVolumeToDetailed(data);
}

// Obtener libros recomendados basados en categorías
export async function getRecommendedBooks(categories: string[] = [], limit: number = 8): Promise<SimpleBook[]> {
  try {
    if (categories.length === 0) {
      // Si no hay categorías, buscar libros populares
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=${limit}&orderBy=relevance`, { cache: 'no-store' });
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.items?.map(mapVolumeToSimple) || [];
    }
    
    // Buscar libros por las categorías favoritas
    const searchQueries = categories.map(cat => `subject:${cat}`).join(' OR ');
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQueries)}&maxResults=${limit}&orderBy=relevance`, { cache: 'no-store' });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.items?.map(mapVolumeToSimple) || [];
  } catch (error) {
    console.error('Error fetching recommended books:', error);
    return [];
  }
}


