import { getCurrentUser } from '../actions/auth';

export default async function MainMenu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
      {/* Welcome Section */}
      <div className="space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 leading-tight font-space-grotesk">
            Encuentra tu próxima aventura
          </h1>
        </div>
        
        {/* Search Section */}
        <div className="space-y-6">
          
          <form action="/?view=search" className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                name="q"
                placeholder="Buscar por título, autor o ISBN..."
                className="flex-1 px-6 py-4 rounded-full text-slate-800 text-lg bg-slate-100/90 backdrop-blur-sm border border-slate-200/50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-300/50 shadow-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-slate-100/20 hover:bg-slate-100/30 text-slate-100 rounded-full transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-200/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Chat Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Asistente IA</h3>
                <p className="text-sm text-slate-400">Recomendaciones personalizadas</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              ¿No sabes qué leer? ¡Habla con nuestro asistente de IA! Cuéntale sobre tus gustos, 
              géneros favoritos o el tipo de historias que te interesan, y recibe recomendaciones 
              personalizadas de libros.
            </p>
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Haz clic en el botón de chat en la esquina inferior derecha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
