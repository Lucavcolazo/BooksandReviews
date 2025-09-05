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
      </div>
    </div>
  );
}
