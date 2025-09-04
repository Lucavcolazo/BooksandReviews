'use client'

import { useState } from 'react';
import { updateUser } from '@/app/actions/users';
import { useAuth } from '@/lib/auth-context';
import Toast from './Toast';

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
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
}

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const { updateUser: updateContextUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || '',
    theme: user.preferences.theme,
    language: user.preferences.language,
    notifications: user.preferences.notifications,
    preferences: user.preferences
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(user.id, {
        displayName: formData.displayName,
        bio: formData.bio,
        preferences: {
          theme: formData.theme as 'light' | 'dark' | 'auto',
          language: formData.language,
          notifications: formData.notifications
        }
      });

      // Actualizar contexto
      updateContextUser({
        displayName: formData.displayName,
        bio: formData.bio,
        preferences: formData.preferences
      });

      setToastMessage('Configuración actualizada exitosamente');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error al actualizar la configuración');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Información Personal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-amber-800 mb-2">
                Nombre para mostrar
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-700 cursor-not-allowed"
                disabled
              />
              <p className="text-amber-600 text-sm mt-1">El email no se puede cambiar</p>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-amber-800 mb-2">
              Biografía
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900"
              placeholder="Cuéntanos sobre ti..."
              disabled={loading}
            />
          </div>

          {/* Preferencias */}
          <div className="border-t border-amber-200 pt-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-4">Preferencias</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-amber-800 mb-2">
                  Tema
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900"
                  disabled={loading}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-amber-800 mb-2">
                  Idioma
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-900"
                  disabled={loading}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="border-t border-amber-200 pt-6">
            <h3 className="text-xl font-semibold text-amber-900 mb-4">Notificaciones</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="notifications.email" className="text-sm font-medium text-amber-800">
                    Notificaciones por email
                  </label>
                  <p className="text-amber-600 text-sm">Recibir notificaciones importantes por email</p>
                </div>
                <input
                  type="checkbox"
                  id="notifications.email"
                  name="notifications.email"
                  checked={formData.notifications.email}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="notifications.push" className="text-sm font-medium text-amber-800">
                    Notificaciones push
                  </label>
                  <p className="text-amber-600 text-sm">Recibir notificaciones en el navegador</p>
                </div>
                <input
                  type="checkbox"
                  id="notifications.push"
                  name="notifications.push"
                  checked={formData.notifications.push}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="notifications.newReviews" className="text-sm font-medium text-amber-800">
                    Nuevas reseñas
                  </label>
                  <p className="text-amber-600 text-sm">Notificarme cuando alguien reseñe un libro que me interesa</p>
                </div>
                <input
                  type="checkbox"
                  id="notifications.newReviews"
                  name="notifications.newReviews"
                  checked={formData.notifications.newReviews}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="notifications.likes" className="text-sm font-medium text-amber-800">
                    Likes en mis reseñas
                  </label>
                  <p className="text-amber-600 text-sm">Notificarme cuando alguien le dé like a mis reseñas</p>
                </div>
                <input
                  type="checkbox"
                  id="notifications.likes"
                  name="notifications.likes"
                  checked={formData.notifications.likes}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="border-t border-amber-200 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-900 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
