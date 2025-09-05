import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import SettingsForm from '@/app/components/SettingsForm';
import CompactNavbar from '@/app/components/CompactNavbar';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    redirect('/auth/login');
  }

  // Serializar el usuario para evitar errores de serialización
  const serializedUser = {
    id: currentUser.user.id,
    email: currentUser.user.email,
    username: currentUser.user.username,
    displayName: currentUser.user.displayName,
    avatar: currentUser.user.avatar,
    bio: currentUser.user.bio,
    createdAt: currentUser.user.createdAt
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <CompactNavbar title="Configuración" />
      
      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Configuración</h1>
          <p className="text-amber-700">Personaliza tu información personal</p>
        </div>
        <SettingsForm user={serializedUser} />
      </main>
    </div>
  );
}
