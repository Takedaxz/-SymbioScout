'use client';

import { useState } from 'react';
import { DetectedSite } from '@/lib/ai-detection';

interface AIDetectionRequest {
  method: 'smart_heuristics' | 'openai_vision';
  request: {
    coordinates: [number, number];
    radius: number;
    areaType: 'urban' | 'suburban' | 'mixed';
  };
}

interface AISiteDetectionProps {
  onSitesDetected: (sites: DetectedSite[]) => void;
  onDetectionStart: () => void;
  onDetectionComplete: () => void;
  detectionCenter?: [number, number] | null;
}

export default function AISiteDetection({ onSitesDetected, onDetectionStart, onDetectionComplete, detectionCenter }: AISiteDetectionProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<'smart_heuristics' | 'openai_vision'>('smart_heuristics');
  const [radius, setRadius] = useState(1000); // meters - default 1km
  const [areaType, setAreaType] = useState<'urban' | 'suburban' | 'mixed'>('urban');

  const handleAIDetection = async () => {
    setIsDetecting(true);
    onDetectionStart();

    try {
      // Use detection center if available, otherwise use Bangkok center
      const currentLocation: [number, number] = detectionCenter || [100.5018, 13.7563];

      const request: AIDetectionRequest = {
        method: detectionMethod,
        request: {
          coordinates: currentLocation,
          radius,
          areaType
        }
      };

      const response = await fetch('/api/ai-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('AI detection failed');
      }

      const data = await response.json();
      onSitesDetected(data.sites);
    } catch (error) {
      console.error('AI detection error:', error);
      // Show error message to user
    } finally {
      setIsDetecting(false);
      onDetectionComplete();
    }
  };

  return (
    <div className="glass-effect rounded-3xl shadow-2xl p-8 card-hover">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-2xl font-bold text-white">1</span>
          </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI-Powered Site Detection</h3>
          <p className="text-gray-600 font-medium text-sm">Automatically discover greening opportunities</p>
          {!detectionCenter && (
            <p className="text-orange-600 font-medium text-sm mt-1">Click on the map above to set detection center</p>
          )}
          {detectionCenter && (
            <p className="text-green-600 font-medium text-sm mt-1">Detection center set! Ready to detect sites.</p>
          )}
        </div>
        </div>

      <div className="space-y-6">
        {/* Detection Method Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Detection Method</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'smart_heuristics', label: 'Self-assign + Smart Heuristics', description: 'Simple rules for fast results' },
              { value: 'openai_vision', label: 'OpenAI Vision (GPT-4V)', description: 'Advanced AI analysis of satellite imagery' }
            ].map((method) => (
              <label key={method.value} className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all hover:border-purple-300">
                <input
                  type="radio"
                  name="detectionMethod"
                  value={method.value}
                  checked={detectionMethod === method.value}
                  onChange={(e) => setDetectionMethod(e.target.value as any)}
                  className="mr-3 text-purple-600"
                />
                <div>
                  <div className="font-medium text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Search Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-600 w-20">{radius >= 1000 ? `${(radius/1000).toFixed(1)}km` : `${radius}m`}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Area Type</label>
            <select
              value={areaType}
              onChange={(e) => setAreaType(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="urban">Urban</option>
              <option value="suburban">Suburban</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Detection Button */}
        <div className="text-center">
          <button
            onClick={handleAIDetection}
            disabled={isDetecting || !detectionCenter}
            className="btn-primary py-4 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetecting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing Area...
              </div>
            ) : !detectionCenter ? (
              'Set Detection Center First'
            ) : (
              'Detect Greening Opportunities'
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/60">
          <h4 className="font-semibold text-blue-800 mb-2">How Smart Heuristics Works</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Analyzes OpenStreetMap data to find gaps between buildings/roads</li>
            <li>• Filters areas between 50-2,000m² with good community access</li>
            <li>• Scores sites based on area, accessibility, and vegetation levels</li>
            <li>• No heavy ML - just open data + simple rules for fast results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
