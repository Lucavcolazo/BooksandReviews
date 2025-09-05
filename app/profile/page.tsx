import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import { getAllReviews } from '@/app/actions/reviews';
import ProfileContent from '@/app/components/ProfileContent';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    redirect('/auth/login');
  }

  const user = currentUser.user;
  
  // Obtener solo las reseñas del usuario actual
  const reviews = await getAllReviews().then(reviews => 
    reviews.filter(review => review.userId === user.id)
  );

  return <ProfileContent user={user} reviews={reviews} />;
}
