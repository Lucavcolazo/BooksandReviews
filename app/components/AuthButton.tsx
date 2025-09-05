'use client'

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { logoutUser } from '@/app/actions/auth';
import Link from 'next/link';
import Toast from './Toast';

export default function AuthButton() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        logout();
        setToastMessage('Sesión cerrada exitosamente');
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage('Error al cerrar sesión');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error al cerrar sesión');
      setToastType('error');
      setShowToast(true);
    }
    setShowUserMenu(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-amber-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-amber-800/30 transition-colors"
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full border-2 border-amber-200"
              />
            ) : (
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-semibold text-sm">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-amber-200 font-medium hidden sm:block">
              {user.displayName}
            </span>
            <svg className="w-4 h-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-amber-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-amber-100">
                <p className="font-semibold text-amber-900">{user.displayName}</p>
                <p className="text-sm text-amber-600">@{user.username}</p>
              </div>
              
              <div className="py-2">
                <Link href="/profile" className="w-full px-4 py-2 text-left text-amber-800 hover:bg-amber-50 transition-colors block">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </div>
                </Link>
                
                <Link href="/settings" className="w-full px-4 py-2 text-left text-amber-800 hover:bg-amber-50 transition-colors block">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configuración
                  </div>
                </Link>
                
              </div>
              
              <div className="border-t border-amber-100 py-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-amber-200 hover:text-white transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Registrarse
        </Link>
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
