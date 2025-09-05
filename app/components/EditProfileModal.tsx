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
}

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const { updateUser: updateContextUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(user.id, {
        displayName: formData.displayName,
        bio: formData.bio
      });

      // Actualizar contexto
      updateContextUser({
        displayName: formData.displayName,
        bio: formData.bio
      });

      setToastMessage('Perfil actualizado exitosamente');
      setToastType('success');
      setShowToast(true);
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setToastMessage('Error al actualizar el perfil');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="bg-slate-100/10 backdrop-blur-sm rounded-lg border border-slate-200/30 p-8 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre para mostrar */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-200 mb-2">
                Nombre para mostrar
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200/50 rounded-lg focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/50 bg-slate-100/10 backdrop-blur-sm text-slate-100 placeholder-slate-400"
                disabled={loading}
                required
              />
            </div>

            {/* Email (solo lectura) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                className="w-full px-4 py-3 border border-slate-200/50 rounded-lg bg-slate-100/5 text-slate-400 cursor-not-allowed"
                disabled
              />
              <p className="text-slate-400 text-sm mt-1">El email no se puede cambiar</p>
            </div>

            {/* Biografía */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-200 mb-2">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200/50 rounded-lg focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/50 bg-slate-100/10 backdrop-blur-sm text-slate-100 placeholder-slate-400"
                placeholder="Cuéntanos sobre ti..."
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-slate-300 hover:text-slate-100 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-slate-200/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
