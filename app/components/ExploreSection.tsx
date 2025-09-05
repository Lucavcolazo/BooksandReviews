import { getRecommendedBooks } from '../actions/books';
import ExploreWithChat from './ExploreWithChat';

export default async function ExploreSection() {
  // Usar categorías por defecto para evitar problemas durante el build
  const categories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
    'Romance', 'Thriller', 'Biography', 'History', 'Self-Help'
  ];
  
  let recommendedBooks: any[] = [];
  
  // Obtener libros recomendados por defecto
  try {
    recommendedBooks = await getRecommendedBooks(categories.slice(0, 3), 12);
  } catch (error) {
    console.error('Error loading default recommendations:', error);
  }

  return <ExploreWithChat 
    categories={categories} 
    recommendedBooks={recommendedBooks} 
    userId={undefined} 
  />;
}
