'use client';

import { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import SiteDetails from '@/components/SiteDetails';
import PlantRecommendations from '@/components/PlantRecommendations';
import ImpactMetrics from '@/components/ImpactMetrics';
import ProposalGenerator from '@/components/ProposalGenerator';
import { DemoSite, demoBangkokSites, defaultSite } from '@/data/demo-sites';
import { Plant, thaiNativePlants, getRecommendedPlants } from '@/data/plants-database';
import { calculateImpact, generatePlantingPlan, PlantingPlan } from '@/lib/impact-calculator';
import { DetectedSite } from '@/lib/ai-detection';
import AISiteDetection from '@/components/AISiteDetection';

export default function Home() {
  const [selectedSite, setSelectedSite] = useState<DemoSite | null>(null);
  const [plantingPlan, setPlantingPlan] = useState<PlantingPlan | null>(null);
  const [impactMetrics, setImpactMetrics] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'map' | 'plan' | 'impact' | 'proposal'>('map');
  const [availableSites, setAvailableSites] = useState<DemoSite[]>(demoBangkokSites);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionCenter, setDetectionCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (selectedSite && currentStep === 'plan') {
      console.log('SymbioScout Debug:', {
        selectedSite: selectedSite.name,
        area: selectedSite.area,
        currentStep,
        timestamp: new Date().toISOString()
      });
      generateInitialPlan();
    }
  }, [selectedSite, currentStep]);

  useEffect(() => {
    console.log('State Update:', {
      currentStep,
      hasSelectedSite: !!selectedSite,
      hasPlantingPlan: !!plantingPlan,
      hasImpactMetrics: !!impactMetrics,
      isGenerating
    });
  }, [currentStep, selectedSite, plantingPlan, impactMetrics, isGenerating]);

  const generateInitialPlan = async () => {
    if (!selectedSite) return;

    setIsGenerating(true);
    
    try {
      // Generate planting plan based on site characteristics
      const siteType = selectedSite.name.toLowerCase().includes('rooftop') ? 'rooftop' : 'ground';
      const recommendedPlants = getRecommendedPlants(selectedSite.area, siteType);
      const plan = generatePlantingPlan(selectedSite.area, siteType, recommendedPlants);
      
      setPlantingPlan(plan);
      
      // Calculate impact metrics
      const impact = calculateImpact(plan);
      setImpactMetrics(impact);
      
      setCurrentStep('plan');
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSiteSelect = (site: DemoSite) => {
    setSelectedSite(site);
    setCurrentStep('map');
  };

  const handleContinueToPlan = () => {
    if (selectedSite) {
      setCurrentStep('plan');
    }
  };

  const handleGenerateProposal = () => {
    setCurrentStep('proposal');
  };

  const handleAISitesDetected = (detectedSites: DetectedSite[]) => {
    // Convert detected sites to DemoSite format
    const convertedSites: DemoSite[] = detectedSites.map((site, index) => ({
      id: site.id,
      name: `AI Detected Site ${index + 1}`,
      coordinates: site.coordinates,
      area: site.area,
      description: site.description,
      currentUse: site.currentUse,
      potential: site.potential
    }));

    // Add AI detected sites to available sites
    setAvailableSites([...demoBangkokSites, ...convertedSites]);
  };

  const handleDetectionStart = () => {
    setIsDetecting(true);
  };

  const handleDetectionComplete = () => {
    setIsDetecting(false);
  };

  const handleMapClick = (coordinates: [number, number]) => {
    setDetectionCenter(coordinates);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect shadow-2xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  SymbioScout
                </h1>
                <p className="text-base text-gray-600 font-medium mt-1">AI-Powered Urban Greening Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/85 rounded-2xl px-6 py-3 backdrop-blur-md border border-gray-200/60 shadow-lg">
              <span className="text-lg font-semibold text-gray-800">Bangkok, Thailand</span>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/60"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="glass-effect border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="flex items-center justify-center space-x-8">
            {[
              { key: 'map', label: 'Discover', icon: '1' },
              { key: 'plan', label: 'Plan', icon: '2' },
              { key: 'impact', label: 'Impact', icon: '3' },
              { key: 'proposal', label: 'Proposal', icon: '4' }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div 
                  className={`progress-step cursor-pointer ${
                    currentStep === step.key 
                      ? 'active' 
                      : ['map', 'plan', 'impact'].indexOf(currentStep) > index 
                        ? 'completed'
                        : ''
                  }`}
                  onClick={() => {
                    // Allow navigation to previous steps or current step
                    if (step.key === 'map' || 
                        (step.key === 'plan' && selectedSite) ||
                        (step.key === 'impact' && impactMetrics) ||
                        (step.key === 'proposal' && impactMetrics)) {
                      setCurrentStep(step.key as any);
                    }
                  }}
                >
                  <span className="text-xl mr-3">{step.icon}</span>
                  <span className="font-bold text-base">{step.label}</span>
                </div>
                {index < 3 && (
                  <div className={`w-20 h-2 mx-8 rounded-full transition-all duration-500 ${
                    ['map', 'plan', 'impact', 'proposal'].indexOf(currentStep) > index
                      ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 shadow-lg shadow-green-400/30'
                      : 'bg-gray-300/60'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {currentStep === 'map' && (
          <div className="space-y-8">
            {/* Map - First (1) */}
            <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden card-hover">
                 <div className="p-8 border-b border-gray-200/50">
                   <div className="flex items-center mb-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                       <span className="text-2xl font-bold text-white">0</span>
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">Discover Greening Opportunities</h2>
                       <p className="text-gray-600 text-base font-medium mt-1">Click on the map to set detection center, then use AI to find potential greening sites</p>
                     </div>
                   </div>
                 </div>
              <div className="h-[550px]">
                 <MapComponent
                   sites={availableSites}
                   selectedSite={selectedSite}
                   onSiteSelect={handleSiteSelect}
                   detectionCenter={detectionCenter}
                   onMapClick={handleMapClick}
                 />
              </div>
            </div>

             {/* AI Site Detection - First (1) */}
             <AISiteDetection
               onSitesDetected={handleAISitesDetected}
               onDetectionStart={handleDetectionStart}
               onDetectionComplete={handleDetectionComplete}
               detectionCenter={detectionCenter}
             />

             {/* Available Sites - Second (2) - Only show after AI detection */}
             {availableSites.length > 0 && (
               <div className="glass-effect rounded-3xl shadow-2xl p-8 card-hover">
                 <div className="flex items-center mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                     <span className="text-2xl font-bold text-white">2</span>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Available Sites</h3>
                 </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {availableSites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => handleSiteSelect(site)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all card-hover ${
                      selectedSite?.id === site.id
                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-400/20'
                        : 'border-gray-200/60 hover:border-green-400/60 bg-white/85'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{site.name}</h4>
                    <p className="text-gray-600 font-medium text-base">{site.area}m²</p>
                    <p className="text-gray-500 text-sm mt-1">{site.currentUse}</p>
                  </div>
                ))}
              </div>
               </div>
             )}

             {/* Site Details - Third (3) - Separate card below AI detection */}
             {selectedSite && (
               <div className="glass-effect rounded-3xl shadow-2xl p-8 card-hover">
                 <div className="flex items-center mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                     <span className="text-2xl font-bold text-white">3</span>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Site Details</h3>
                 </div>
                 <SiteDetails site={selectedSite} />

                 {/* Continue Button - Below Site Details */}
                 <div className="text-center mt-8">
                   <button
                     onClick={handleContinueToPlan}
                     className="btn-primary py-4 px-8 text-lg"
                   >
                     Continue to Plant Plan →
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {currentStep === 'plan' && selectedSite && plantingPlan && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('map')}
                className="btn-secondary py-2 px-4 text-sm"
              >
                ← Back to Map
              </button>
              <div className="text-sm text-gray-500 font-medium">
                Step 2 of 4
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Main Plant Recommendations - Takes 2 columns on large screens */}
              <div className="xl:col-span-2">
                 <div className="glass-effect rounded-3xl shadow-2xl p-8 card-hover">
                   <div className="flex items-center mb-6">
                     <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                       <span className="text-2xl font-bold text-white">2</span>
                     </div>
                     <h2 className="text-xl font-bold text-gray-900">AI-Generated Plant Plan</h2>
                   </div>
                  <PlantRecommendations
                    site={selectedSite}
                    plantingPlan={plantingPlan}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
              
              {/* Sidebar with Summary and Actions */}
              <div className="space-y-6">
                <div className="glass-effect rounded-3xl shadow-2xl p-6 card-hover">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                      <span className="text-xl font-bold text-white">S</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Planting Summary</h3>
                  </div>
                  <div className="space-y-4">
                    {plantingPlan.plants.map(({ plant, quantity }) => (
                      <div key={plant.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/60 shadow-sm">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{plant.name}</h4>
                          <p className="text-xs text-gray-600 font-medium">{plant.scientificName}</p>
                        </div>
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md">{quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>


                <button
                  onClick={() => setCurrentStep('impact')}
                  className="w-full btn-primary py-4 px-6 text-lg"
                >
                  View Impact Analysis →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'impact' && impactMetrics && (
          <div className="space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('plan')}
                className="btn-secondary py-2 px-4 text-sm"
              >
                ← Back to Plant Plan
              </button>
              <div className="text-sm text-gray-500 font-medium">
                Step 3 of 4
              </div>
            </div>
            <div className="text-center">
                 <div className="flex items-center justify-center mb-4">
                   <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                     <span className="text-3xl font-bold text-white">3</span>
                   </div>
                   <h2 className="text-2xl font-bold gradient-text">Environmental Impact Analysis</h2>
                 </div>
              <p className="text-gray-600 text-base font-medium">Estimated benefits of your greening project</p>
            </div>
            
            <ImpactMetrics metrics={impactMetrics} />
            
            
            <div className="text-center">
              <button
                onClick={handleGenerateProposal}
                className="btn-primary py-4 px-8 text-lg"
              >
                Generate Community Proposal →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'proposal' && selectedSite && plantingPlan && impactMetrics && (
          <ProposalGenerator
            site={selectedSite}
            plantingPlan={plantingPlan}
            impactMetrics={impactMetrics}
          />
        )}
      </main>
    </div>
  );
}
