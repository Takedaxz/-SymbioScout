import { DemoSite } from '@/data/demo-sites';

interface SiteDetailsProps {
  site: DemoSite;
}

export default function SiteDetails({ site }: SiteDetailsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Location</h4>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{site.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Area</h4>
          <p className="text-gray-700 font-semibold text-base sm:text-lg">{site.area} m²</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Current Use</h4>
          <p className="text-gray-700 font-semibold text-sm sm:text-base">{site.currentUse}</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">Greening Potential</h4>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{site.potential}</p>
      </div>

      <div className="pt-4 sm:pt-6 border-t border-gray-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Coordinates</span>
          <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-lg shadow-sm text-xs sm:text-sm">
            {site.coordinates[1].toFixed(4)}, {site.coordinates[0].toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
