'use client';

import { useState } from 'react';
import Link from 'next/link';
import BookCard from './BookCard';
import BookChat from './BookChat';

interface ExploreWithChatProps {
  categories: string[];
  recommendedBooks: any[];
  userId?: string;
}

export default function ExploreWithChat({ categories, recommendedBooks, userId }: ExploreWithChatProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 font-space-grotesk">
              Descubre Nuevos Libros
            </h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              {categories.length > 0 
                ? `Basado en tus géneros favoritos: ${categories.join(', ')}`
                : 'Explora libros populares y encuentra tu próxima lectura favorita'
              }
            </p>
          </div>

          {/* AI Chat Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Asistente de Recomendaciones IA</h3>
                    <p className="text-slate-400">Obtén recomendaciones personalizadas basadas en tus gustos</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chatear con IA</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-100">¿Cómo funciona?</h4>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">1</span>
                      </div>
                      <span>Cuéntame sobre tus gustos literarios y géneros favoritos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">2</span>
                      </div>
                      <span>Recibe recomendaciones personalizadas con títulos y autores</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">3</span>
                      </div>
                      <span>Busca los libros recomendados en nuestra biblioteca</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-100">Ejemplos de preguntas:</h4>
                  <div className="space-y-2">
                    <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
                      "Me gustan las novelas de misterio y suspenso"
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
                      "Busco algo de ciencia ficción para principiantes"
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
                      "Quiero algo ligero para leer en vacaciones"
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
                      "Me gustan los libros de Gabriel García Márquez"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {recommendedBooks.length > 0 ? (
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">
                Recomendaciones Basadas en tus Gustos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendedBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-slate-100/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-slate-200/20">
                <div className="w-16 h-16 bg-slate-100/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Aún no hay recomendaciones</h3>
                <p className="text-slate-200 mb-6">
                  Usa el chat con IA para obtener recomendaciones personalizadas o agrega algunos libros a favoritos
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
                  >
                    Chatear con IA
                  </button>
                  <Link 
                    href="/?view=search" 
                    className="bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 px-6 py-3 rounded-full transition-colors backdrop-blur-sm border border-slate-200/30"
                  >
                    Buscar Libros
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      <BookChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
