'use client';

import { useState } from 'react';
import BookChat from './BookChat';

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Botón flotante del chat */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
        title="Chat con IA para recomendaciones"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Indicador de notificación */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">IA</span>
        </div>
      </button>

      {/* Componente del chat */}
      <BookChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
