import { getCurrentUser } from '../actions/auth';
import { getFavoriteCategories } from '../actions/booklists';
import { getRecommendedBooks } from '../actions/books';
import BookCard from './BookCard';
import ExploreWithChat from './ExploreWithChat';

export default async function ExploreSection() {
  // Obtener información del usuario para recomendaciones personalizadas
  const currentUser = await getCurrentUser();
  const userId = currentUser.success ? currentUser.user?.id : undefined;
  
  let categories: string[] = [];
  let recommendedBooks: any[] = [];
  
  if (userId) {
    try {
      categories = await getFavoriteCategories(userId);
      recommendedBooks = await getRecommendedBooks(categories, 12);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }

  return <ExploreWithChat 
    categories={categories} 
    recommendedBooks={recommendedBooks} 
    userId={userId} 
  />;
}
