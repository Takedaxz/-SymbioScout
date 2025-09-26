import { DemoSite } from '@/data/demo-sites';
import { PlantingPlan } from '@/lib/impact-calculator';

interface PlantRecommendationsProps {
  site: DemoSite;
  plantingPlan: PlantingPlan;
  isGenerating: boolean;
}

export default function PlantRecommendations({ site, plantingPlan, isGenerating }: PlantRecommendationsProps) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating plant recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200/60 shadow-sm">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">P</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-green-600">Recommended Native Plants</h3>
            <p className="text-green-500 font-medium text-xs sm:text-sm">AI-Selected for Optimal Growth</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          These plants are specifically selected for <strong className="text-gray-900">{site.name}</strong> based on local climate,
          soil conditions, and ecological benefits. Each species is native to Thailand and perfectly suited for urban environments.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {plantingPlan.plants.map(({ plant, quantity }, index) => (
          <div key={plant.id} className={`plant-card rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 space-y-1 sm:space-y-0 sm:space-x-3">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">{plant.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold badge-${plant.type} w-fit`}>
                    {plant.type}
                  </span>
                </div>
                <p className="text-gray-600 italic font-medium text-xs sm:text-sm">{plant.scientificName}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base shadow-lg w-fit">
                {quantity}
              </div>
            </div>
            
            <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{plant.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">Water Needs</span>
                <p className="text-gray-900 font-medium capitalize text-xs sm:text-sm">{plant.waterNeeds}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">Sun Exposure</span>
                <p className="text-gray-900 font-medium capitalize text-xs sm:text-sm">{plant.sunExposure}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">Mature Height</span>
                <p className="text-gray-900 font-medium text-xs sm:text-sm">{plant.matureSize.height}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">Flowering Season</span>
                <p className="text-gray-900 font-medium text-xs sm:text-sm">{plant.floweringSeason || 'Year-round'}</p>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <h5 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">Ecological Benefits</h5>
              <div className="flex flex-wrap gap-2">
                {plant.benefits.map((benefit, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-200/60 shadow-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {plant.pollinatorAttraction.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 sm:p-4 border border-yellow-200/60 shadow-sm">
                <h5 className="text-xs sm:text-sm font-semibold text-yellow-600 mb-1 sm:mb-2">Pollinator Attraction</h5>
                <p className="text-yellow-700 font-medium text-xs sm:text-sm">
                  Attracts: {plant.pollinatorAttraction.join(', ')}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/60 shadow-sm">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-md">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">I</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-blue-600">Implementation Tips</h4>
        </div>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 text-sm sm:text-lg">•</span>
            <span className="text-sm sm:text-base leading-relaxed">Plant during the rainy season (June-October) for best establishment</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 text-sm sm:text-lg">•</span>
            <span className="text-sm sm:text-base leading-relaxed">Ensure proper drainage, especially for rooftop gardens</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 text-sm sm:text-lg">•</span>
            <span className="text-sm sm:text-base leading-relaxed">Use native soil amendments and organic mulch</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 text-sm sm:text-lg">•</span>
            <span className="text-sm sm:text-base leading-relaxed">Water regularly during the first 3 months after planting</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2 text-sm sm:text-lg">•</span>
            <span className="text-sm sm:text-base leading-relaxed">Consider community involvement for maintenance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
