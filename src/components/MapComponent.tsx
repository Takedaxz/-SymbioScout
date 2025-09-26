'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { DemoSite } from '@/data/demo-sites';

interface MapComponentProps {
  sites: DemoSite[];
  selectedSite: DemoSite | null;
  onSiteSelect: (site: DemoSite) => void;
  detectionCenter?: [number, number] | null;
  onMapClick?: (coordinates: [number, number]) => void;
}

export default function MapComponent({ sites, selectedSite, onSiteSelect, detectionCenter, onMapClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const detectionMarker = useRef<mapboxgl.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [100.5018, 13.7563], // Bangkok center
      zoom: 13,
      pitch: 0,
      bearing: 0
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      addSiteMarkers();
    });

    map.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addSiteMarkers = () => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    sites.forEach((site) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${selectedSite?.id === site.id ? '#22c55e' : '#3b82f6'};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        font-weight: bold;
        transition: all 0.2s ease;
      `;
      markerElement.innerHTML = '•';

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(site.coordinates)
        .addTo(map.current!);

      markerElement.addEventListener('click', () => {
        onSiteSelect(site);
        // Update marker styles
        markers.current.forEach(m => {
          const el = m.getElement();
          if (el) {
            el.style.background = '#3b82f6';
          }
        });
        markerElement.style.background = '#22c55e';
      });

      markers.current.push(marker);
    });

    // Fit map to show all sites
    if (sites.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      sites.forEach(site => bounds.extend(site.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const addDetectionCenterMarker = () => {
    if (!map.current || !isLoaded || !detectionCenter) return;

    // Remove existing detection marker
    if (detectionMarker.current) {
      detectionMarker.current.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.className = 'detection-center-marker';
    markerElement.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #8b5cf6;
      border: 4px solid white;
      box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      font-weight: bold;
      animation: pulse 2s infinite;
    `;
    markerElement.innerHTML = '📍';

    detectionMarker.current = new mapboxgl.Marker(markerElement)
      .setLngLat(detectionCenter)
      .addTo(map.current!);
  };

  useEffect(() => {
    if (isLoaded) {
      addSiteMarkers();
    }
  }, [isLoaded, selectedSite]);

  useEffect(() => {
    if (isLoaded) {
      addDetectionCenterMarker();
    }
  }, [isLoaded, detectionCenter]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Map overlay with site info */}
      {selectedSite && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 sm:p-4 max-w-xs sm:max-w-sm border border-gray-200">
          <h3 className="font-semibold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2">
            {selectedSite.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            {selectedSite.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
            <span>Area: {selectedSite.area}m²</span>
            <span>Type: {selectedSite.currentUse}</span>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200">
        <div className="text-xs text-gray-600">
          {detectionCenter && (
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
              <span className="hidden sm:inline">Detection Center</span>
              <span className="sm:hidden">Center</span>
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
            <span className="hidden sm:inline">Available Sites</span>
            <span className="sm:hidden">Sites</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            <span className="hidden sm:inline">Selected Site</span>
            <span className="sm:hidden">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
