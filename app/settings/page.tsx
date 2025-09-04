import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';
import SettingsForm from '@/app/components/SettingsForm';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Verificar autenticación
  const currentUser = await getCurrentUser();
  if (!currentUser.success || !currentUser.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Configuración</h1>
          <p className="text-amber-200">Personaliza tu experiencia en Books & Reviews</p>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SettingsForm user={currentUser.user} />
      </main>
    </div>
  );
}
