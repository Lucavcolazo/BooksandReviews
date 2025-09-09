import RecommendationsSlider from './RecommendationsSlider';

export default async function ExploreSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6">Descubrir</h2>
      <RecommendationsSlider />
    </div>
  );
}
