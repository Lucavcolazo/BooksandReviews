'use client'

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AuthButton() {
  const { user, isAuthenticated, loading } = useAuth();

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
      <Link
        href="/profile"
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100/20 transition-colors"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.displayName}
            className="w-8 h-8 rounded-full border-2 border-slate-200"
          />
        ) : (
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-slate-800 font-semibold text-sm">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-slate-100 font-medium hidden sm:block">
          {user.displayName}
        </span>
      </Link>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-slate-200 hover:text-slate-100 transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 bg-slate-100/20 text-slate-100 rounded-lg hover:bg-slate-100/30 transition-colors backdrop-blur-sm border border-slate-200/30"
        >
          Registrarse
        </Link>
      </div>
    </>
  );
}
