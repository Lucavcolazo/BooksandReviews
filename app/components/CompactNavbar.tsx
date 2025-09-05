'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface CompactNavbarProps {
  title?: string;
  showBackButton?: boolean;
}

export default function CompactNavbar({ title = "Books & Reviews", showBackButton = true }: CompactNavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <nav className="bg-slate-800/50 backdrop-blur-sm text-white px-4 py-3 shadow-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                aria-label="Volver atrás"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-colors"
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
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-slate-300 hover:text-slate-100 transition-colors text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 bg-slate-100/20 text-slate-100 rounded-lg hover:bg-slate-100/30 transition-colors text-sm backdrop-blur-sm border border-slate-200/30"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
