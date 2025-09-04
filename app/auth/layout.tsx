import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header simplificado para auth */}
      <header className="bg-amber-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Books & Reviews
            </Link>
            <Link 
              href="/" 
              className="text-amber-200 hover:text-white transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido de autenticación */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-amber-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-700">
            © 2024 Books & Reviews. Tu biblioteca personal en línea.
          </p>
        </div>
      </footer>
    </div>
  );
}
