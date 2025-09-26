import { ImpactMetrics as ImpactMetricsType } from '@/lib/impact-calculator';

interface ImpactMetricsProps {
  metrics: ImpactMetricsType;
}

export default function ImpactMetrics({ metrics }: ImpactMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Stormwater Reduction */}
      <div className="impact-card border-blue-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">W</span>
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Stormwater</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Runoff Reduction</p>
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          {metrics.stormwaterReduction.litersPerYear.toLocaleString()}L
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 sm:mb-3">per year</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {metrics.stormwaterReduction.description}
        </p>
      </div>

      {/* CO2 Sequestration */}
      <div className="impact-card border-green-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">C</span>
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Carbon</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Sequestration</p>
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
          {metrics.co2Sequestration.kgPerYear}kg
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 sm:mb-3">CO₂ per year</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Equivalent to {metrics.co2Sequestration.equivalent}
        </p>
      </div>

      {/* Biodiversity Support */}
      <div className="impact-card border-purple-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">B</span>
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Biodiversity</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Support Level</p>
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
          metrics.biodiversitySupport.level === 'high' ? 'bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent' :
          metrics.biodiversitySupport.level === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' :
          'bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent'
        }`}>
          {metrics.biodiversitySupport.level.toUpperCase()}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 sm:mb-3">
          {metrics.biodiversitySupport.pollinatorSpecies} pollinator species
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {metrics.biodiversitySupport.description}
        </p>
      </div>

      {/* Air Quality */}
      <div className="impact-card border-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">A</span>
          </div>
          <div className="ml-3 sm:ml-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Air Quality</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Improvement</p>
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
          HIGH
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 sm:mb-3">pollutant reduction</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {metrics.airQualityImprovement.description}
        </p>
      </div>
    </div>
  );
}
