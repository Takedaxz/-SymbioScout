import { Plant } from '@/data/plants-database';

export interface ImpactMetrics {
  stormwaterReduction: {
    litersPerYear: number;
    description: string;
  };
  co2Sequestration: {
    kgPerYear: number;
    equivalent: string;
  };
  biodiversitySupport: {
    level: 'low' | 'medium' | 'high';
    description: string;
    pollinatorSpecies: number;
  };
  airQualityImprovement: {
    description: string;
    pollutantsReduced: string[];
  };
}

export interface PlantingPlan {
  plants: {
    plant: Plant;
    quantity: number;
  }[];
  totalArea: number;
}

export const calculateImpact = (plan: PlantingPlan): ImpactMetrics => {
  let totalStormwaterReduction = 0;
  let totalCo2Sequestration = 0;
  let totalPollinatorSpecies = new Set<string>();
  let hasTrees = false;
  let hasFlowers = false;
  let hasHerbs = false;

  plan.plants.forEach(({ plant, quantity }) => {
    // Calculate stormwater reduction
    totalStormwaterReduction += plant.stormwaterReduction * quantity;
    
    // Calculate CO2 sequestration
    totalCo2Sequestration += plant.co2Sequestration * quantity;
    
    // Track pollinator species
    plant.pollinatorAttraction.forEach(pollinator => {
      totalPollinatorSpecies.add(pollinator);
    });
    
    // Track plant types for biodiversity assessment
    if (plant.type === 'tree') hasTrees = true;
    if (plant.type === 'flower' || plant.type === 'herb') hasFlowers = true;
    if (plant.type === 'herb') hasHerbs = true;
  });

  // Calculate biodiversity support level
  let biodiversityLevel: 'low' | 'medium' | 'high' = 'low';
  let biodiversityDescription = '';
  
  if (hasTrees && hasFlowers && hasHerbs && totalPollinatorSpecies.size >= 4) {
    biodiversityLevel = 'high';
    biodiversityDescription = 'Excellent biodiversity support with diverse plant types and multiple pollinator species';
  } else if ((hasTrees && hasFlowers) || totalPollinatorSpecies.size >= 3) {
    biodiversityLevel = 'medium';
    biodiversityDescription = 'Good biodiversity support with mixed plant types and several pollinator species';
  } else {
    biodiversityLevel = 'low';
    biodiversityDescription = 'Basic biodiversity support with limited plant diversity';
  }

  // Calculate CO2 equivalent
  const carMilesPerYear = Math.round(totalCo2Sequestration / 0.4); // Roughly 0.4 kg CO2 per mile
  const co2Equivalent = carMilesPerYear > 1000 
    ? `${Math.round(carMilesPerYear / 1000)}k miles of car travel`
    : `${carMilesPerYear} miles of car travel`;

  return {
    stormwaterReduction: {
      litersPerYear: Math.round(totalStormwaterReduction),
      description: `This garden can absorb approximately ${Math.round(totalStormwaterReduction)} liters of stormwater per year, helping reduce local flooding and improving water quality.`
    },
    co2Sequestration: {
      kgPerYear: Math.round(totalCo2Sequestration),
      equivalent: co2Equivalent
    },
    biodiversitySupport: {
      level: biodiversityLevel,
      description: biodiversityDescription,
      pollinatorSpecies: totalPollinatorSpecies.size
    },
    airQualityImprovement: {
      description: hasTrees 
        ? 'Trees and plants will filter air pollutants including PM2.5, NOx, and ozone, improving local air quality.'
        : 'Plants will help filter air pollutants and improve local air quality.',
      pollutantsReduced: ['PM2.5', 'NOx', 'Ozone', 'CO2']
    }
  };
};

export const generatePlantingPlan = (
  area: number, 
  siteType: 'rooftop' | 'ground',
  availablePlants: Plant[]
): PlantingPlan => {
  const plan: PlantingPlan = {
    plants: [],
    totalArea: area
  };

  // Simple planting logic based on area and site type
  if (siteType === 'rooftop') {
    // Rooftop gardens - lighter plants, more herbs and flowers
    const herbs = availablePlants.filter(p => p.type === 'herb');
    const flowers = availablePlants.filter(p => p.type === 'flower');
    const vines = availablePlants.filter(p => p.type === 'vine');
    
    if (herbs.length > 0) {
      plan.plants.push({ plant: herbs[0], quantity: Math.max(1, Math.floor(area / 20)) });
    }
    if (flowers.length > 0) {
      plan.plants.push({ plant: flowers[0], quantity: Math.max(1, Math.floor(area / 15)) });
    }
    if (vines.length > 0) {
      plan.plants.push({ plant: vines[0], quantity: Math.max(1, Math.floor(area / 30)) });
    }
  } else {
    // Ground sites - can support larger plants
    const trees = availablePlants.filter(p => p.type === 'tree');
    const shrubs = availablePlants.filter(p => p.type === 'shrub');
    const herbs = availablePlants.filter(p => p.type === 'herb');
    const flowers = availablePlants.filter(p => p.type === 'flower');
    
    // Add trees for larger areas
    if (area >= 100 && trees.length > 0) {
      plan.plants.push({ plant: trees[0], quantity: Math.min(3, Math.floor(area / 50)) });
    }
    
    // Add shrubs
    if (shrubs.length > 0) {
      plan.plants.push({ plant: shrubs[0], quantity: Math.max(1, Math.floor(area / 25)) });
    }
    
    // Add herbs and flowers
    if (herbs.length > 0) {
      plan.plants.push({ plant: herbs[0], quantity: Math.max(1, Math.floor(area / 20)) });
    }
    if (flowers.length > 0) {
      plan.plants.push({ plant: flowers[0], quantity: Math.max(1, Math.floor(area / 15)) });
    }
  }

  return plan;
};
