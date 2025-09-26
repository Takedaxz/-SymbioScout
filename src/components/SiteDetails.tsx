import { DemoSite } from '@/data/demo-sites';

interface SiteDetailsProps {
  site: DemoSite;
}

export default function SiteDetails({ site }: SiteDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-lg">Location</h4>
        <p className="text-gray-700 leading-relaxed text-base">{site.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-2 text-base">Area</h4>
          <p className="text-gray-700 font-semibold text-lg">{site.area} m²</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-2 text-base">Current Use</h4>
          <p className="text-gray-700 font-semibold text-base">{site.currentUse}</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-gray-900 mb-3 text-lg">Greening Potential</h4>
        <p className="text-gray-700 leading-relaxed text-base">{site.potential}</p>
      </div>

      <div className="pt-6 border-t border-gray-200/60">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium text-base">Coordinates</span>
          <span className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded-lg shadow-sm text-sm">
            {site.coordinates[1].toFixed(4)}, {site.coordinates[0].toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
