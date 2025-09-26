import { DemoSite } from '@/data/demo-sites';

export interface AIDetectionRequest {
  coordinates: [number, number]; // [lng, lat]
  radius: number; // in meters
  areaType: 'urban' | 'suburban' | 'mixed';
}

export interface DetectedSite {
  id: string;
  coordinates: [number, number];
  area: number;
  confidence: number;
  siteType: 'vacant_lot' | 'rooftop' | 'parking_lot' | 'median' | 'sidewalk';
  description: string;
  currentUse: string;
  potential: string;
  imageUrl?: string;
}

// Option 1: Smart Heuristics with OpenStreetMap data
export const detectSitesWithSmartHeuristics = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  try {
    // Use OpenStreetMap data to find potential greening opportunities
    const sites = await analyzeOpenStreetMapData(request);
    return sites;
  } catch (error) {
    console.error('Smart heuristics error:', error);
    throw new Error('Failed to analyze with smart heuristics');
  }
};

// Option 2: OpenAI Vision API (GPT-4V) for satellite image analysis
export const detectSitesWithOpenAIVision = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  try {
    // This would use GPT-4V to analyze satellite imagery
    const mockResponse = await simulateOpenAIVisionAnalysis(request);
    return mockResponse;
  } catch (error) {
    console.error('OpenAI Vision error:', error);
    throw new Error('Failed to analyze with OpenAI Vision');
  }
};

// Option 3: OpenAI Vision API (GPT-4V) for image analysis
export const detectSitesWithOpenAI = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  try {
    const response = await fetch('/api/ai-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'openai_vision',
        request
      }),
    });

    if (!response.ok) {
      throw new Error('AI detection failed');
    }

    const data = await response.json();
    return data.sites;
  } catch (error) {
    console.error('OpenAI Vision error:', error);
    throw new Error('Failed to analyze with OpenAI Vision');
  }
};

// Option 3: Hybrid approach - combine multiple data sources
export const detectSitesHybrid = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  try {
    // Combine smart heuristics with OpenAI Vision analysis
    const [heuristicsResults, visionResults] = await Promise.all([
      detectSitesWithSmartHeuristics(request),
      detectSitesWithOpenAIVision(request)
    ]);

    // Merge and rank results
    return mergeAndRankResults(heuristicsResults, visionResults, []);
  } catch (error) {
    console.error('Hybrid detection error:', error);
    throw new Error('Failed to run hybrid detection');
  }
};

// Helper functions
const simulateGoogleVisionAnalysis = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return [
    {
      id: 'ai-detected-1',
      coordinates: [100.4945, 13.7462],
      area: 120,
      confidence: 0.87,
      siteType: 'vacant_lot',
      description: 'AI detected vacant lot with good sun exposure and accessibility',
      currentUse: 'Unused space',
      potential: 'Community garden with native plants'
    },
    {
      id: 'ai-detected-2',
      coordinates: [100.5089, 13.7400],
      area: 80,
      confidence: 0.92,
      siteType: 'rooftop',
      description: 'Flat rooftop space suitable for green roof installation',
      currentUse: 'Unused rooftop',
      potential: 'Urban farming and air quality improvement'
    }
  ];
};

const simulateOpenAIVisionAnalysis = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  // Simulate OpenAI Vision analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const baseLng = request.coordinates[0];
  const baseLat = request.coordinates[1];
  
  return [
    {
      id: `openai-vision-${Date.now()}-1`,
      coordinates: [baseLng + 0.003, baseLat + 0.002],
      area: 110,
      confidence: 0.89,
      siteType: 'vacant_lot',
      description: 'AI-detected vacant lot through satellite imagery analysis. Good sun exposure and accessibility.',
      currentUse: 'Unused space',
      potential: 'Community garden with educational signage'
    },
    {
      id: `openai-vision-${Date.now()}-2`,
      coordinates: [baseLng - 0.002, baseLat + 0.003],
      area: 75,
      confidence: 0.91,
      siteType: 'rooftop',
      description: 'Flat rooftop identified through building analysis. Suitable for green roof installation.',
      currentUse: 'Unused rooftop',
      potential: 'Urban farming hub with rainwater collection'
    }
  ];
};

const analyzeOpenStreetMapData = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  // Simulate OSM data analysis with realistic Bangkok locations
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const baseLng = request.coordinates[0];
  const baseLat = request.coordinates[1];
  
  // Generate realistic potential sites based on Bangkok urban patterns
  const potentialSites: DetectedSite[] = [
    {
      id: `heuristics-${Date.now()}-1`,
      coordinates: [baseLng + 0.002, baseLat + 0.001],
      area: 85,
      confidence: 0.92,
      siteType: 'vacant_lot',
      description: 'Vacant lot identified through OSM gap analysis. Area between buildings with good street access.',
      currentUse: 'Unused space between buildings',
      potential: 'Community garden with native plants and seating area'
    },
    {
      id: `heuristics-${Date.now()}-2`,
      coordinates: [baseLng - 0.001, baseLat + 0.002],
      area: 120,
      confidence: 0.88,
      siteType: 'parking_lot',
      description: 'Underutilized parking area with low usage patterns. Adjacent to sidewalk for community access.',
      currentUse: 'Occasional parking space',
      potential: 'Permeable paving with native plant islands and rain gardens'
    },
    {
      id: `heuristics-${Date.now()}-3`,
      coordinates: [baseLng + 0.001, baseLat - 0.001],
      area: 65,
      confidence: 0.85,
      siteType: 'rooftop',
      description: 'Flat rooftop space identified through building footprint analysis. Good structural capacity.',
      currentUse: 'Unused rooftop',
      potential: 'Green roof with urban farming and air quality improvement'
    },
    {
      id: `heuristics-${Date.now()}-4`,
      coordinates: [baseLng - 0.002, baseLat - 0.001],
      area: 45,
      confidence: 0.90,
      siteType: 'median',
      description: 'Street median with low vegetation. High pedestrian traffic area.',
      currentUse: 'Basic grass median',
      potential: 'Native plant median with pollinator support'
    }
  ];

  // Apply scoring algorithm
  const scoredSites = potentialSites.map(site => ({
    ...site,
    score: calculateSiteScore(site, request)
  }));

  // Sort by score and return top results
  return scoredSites
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Return top 3 sites
    .map(({ score, ...site }) => site); // Remove score from final result
};

const calculateSiteScore = (site: DetectedSite, request: AIDetectionRequest): number => {
  // Simple scoring algorithm as specified
  const areaNorm = Math.min(site.area / 1000, 1); // Normalize area (max 1000m²)
  const accessNorm = 0.8; // Assume good access for demo
  const ndviNorm = 0.3; // Assume low vegetation (good for greening)
  const adjacentGreenNorm = 0.6; // Assume moderate distance to green spaces
  
  const score = 0.4 * areaNorm + 0.3 * accessNorm + 0.2 * (1 - ndviNorm) + 0.1 * adjacentGreenNorm;
  return score;
};

const checkZoningData = async (request: AIDetectionRequest): Promise<DetectedSite[]> => {
  // Check city zoning data for allowed uses
  return [];
};

const mergeAndRankResults = (satellite: DetectedSite[], osm: DetectedSite[], zoning: DetectedSite[]): DetectedSite[] => {
  // Combine results and rank by confidence and feasibility
  const allSites = [...satellite, ...osm, ...zoning];
  return allSites.sort((a, b) => b.confidence - a.confidence);
};
