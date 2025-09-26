export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  type: 'tree' | 'shrub' | 'herb' | 'flower' | 'vine';
  nativeTo: string[];
  benefits: string[];
  waterNeeds: 'low' | 'medium' | 'high';
  sunExposure: 'full' | 'partial' | 'shade';
  matureSize: {
    height: string;
    width: string;
  };
  floweringSeason?: string;
  pollinatorAttraction: string[];
  co2Sequestration: number; // kg CO2 per year
  stormwaterReduction: number; // liters per year per plant
  description: string;
}

export const thaiNativePlants: Plant[] = [
  {
    id: 'frangipani',
    name: 'Frangipani (ลีลาวดี)',
    scientificName: 'Plumeria rubra',
    type: 'tree',
    nativeTo: ['Thailand', 'Southeast Asia'],
    benefits: ['Air purification', 'Shade provision', 'Aesthetic value'],
    waterNeeds: 'low',
    sunExposure: 'full',
    matureSize: {
      height: '6-8m',
      width: '4-6m'
    },
    floweringSeason: 'Year-round',
    pollinatorAttraction: ['Bees', 'Butterflies', 'Moths'],
    co2Sequestration: 25,
    stormwaterReduction: 150,
    description: 'Beautiful flowering tree with fragrant white or pink flowers. Drought-tolerant and perfect for urban environments.'
  },
  {
    id: 'siam-tulip',
    name: 'Siam Tulip (กระเจียว)',
    scientificName: 'Curcuma alismatifolia',
    type: 'herb',
    nativeTo: ['Thailand', 'Laos', 'Cambodia'],
    benefits: ['Pollinator support', 'Soil stabilization', 'Medicinal properties'],
    waterNeeds: 'medium',
    sunExposure: 'partial',
    matureSize: {
      height: '60-80cm',
      width: '30-40cm'
    },
    floweringSeason: 'Rainy season (June-October)',
    pollinatorAttraction: ['Bees', 'Butterflies'],
    co2Sequestration: 2,
    stormwaterReduction: 20,
    description: 'Native flowering plant with beautiful pink-purple flowers. Excellent for rain gardens and pollinator support.'
  },
  {
    id: 'neem',
    name: 'Neem Tree (สะเดา)',
    scientificName: 'Azadirachta indica',
    type: 'tree',
    nativeTo: ['Thailand', 'India', 'Southeast Asia'],
    benefits: ['Air purification', 'Natural pesticide', 'Medicinal properties', 'Shade'],
    waterNeeds: 'low',
    sunExposure: 'full',
    matureSize: {
      height: '15-20m',
      width: '10-15m'
    },
    floweringSeason: 'February-April',
    pollinatorAttraction: ['Bees', 'Birds'],
    co2Sequestration: 35,
    stormwaterReduction: 200,
    description: 'Fast-growing tree with natural pest-repellent properties. Excellent for urban air quality improvement.'
  },
  {
    id: 'marigold',
    name: 'Marigold (ดาวเรือง)',
    scientificName: 'Tagetes erecta',
    type: 'flower',
    nativeTo: ['Thailand', 'Mexico'],
    benefits: ['Pest control', 'Pollinator support', 'Colorful display'],
    waterNeeds: 'low',
    sunExposure: 'full',
    matureSize: {
      height: '30-60cm',
      width: '20-30cm'
    },
    floweringSeason: 'Year-round',
    pollinatorAttraction: ['Bees', 'Butterflies'],
    co2Sequestration: 1,
    stormwaterReduction: 10,
    description: 'Bright orange-yellow flowers that naturally repel pests while attracting beneficial pollinators.'
  },
  {
    id: 'lemongrass',
    name: 'Lemongrass (ตะไคร้)',
    scientificName: 'Cymbopogon citratus',
    type: 'herb',
    nativeTo: ['Thailand', 'Southeast Asia'],
    benefits: ['Culinary use', 'Mosquito repellent', 'Soil erosion control'],
    waterNeeds: 'medium',
    sunExposure: 'full',
    matureSize: {
      height: '1-1.5m',
      width: '60-90cm'
    },
    floweringSeason: 'Rarely flowers',
    pollinatorAttraction: ['Bees'],
    co2Sequestration: 3,
    stormwaterReduction: 25,
    description: 'Aromatic grass used in Thai cuisine. Natural mosquito repellent and excellent for soil stabilization.'
  },
  {
    id: 'bougainvillea',
    name: 'Bougainvillea (เฟื่องฟ้า)',
    scientificName: 'Bougainvillea spectabilis',
    type: 'vine',
    nativeTo: ['Thailand', 'South America'],
    benefits: ['Colorful display', 'Privacy screening', 'Drought tolerance'],
    waterNeeds: 'low',
    sunExposure: 'full',
    matureSize: {
      height: '3-6m',
      width: '2-4m'
    },
    floweringSeason: 'Year-round',
    pollinatorAttraction: ['Bees', 'Hummingbirds'],
    co2Sequestration: 8,
    stormwaterReduction: 40,
    description: 'Vibrant flowering vine with colorful bracts. Perfect for walls, fences, and vertical greening.'
  }
];

export const getPlantsByType = (type: Plant['type']): Plant[] => {
  return thaiNativePlants.filter(plant => plant.type === type);
};

export const getRecommendedPlants = (area: number, siteType: 'rooftop' | 'ground'): Plant[] => {
  // Simple recommendation logic based on area and site type
  const recommendations: Plant[] = [];
  
  if (siteType === 'rooftop') {
    // Rooftop gardens need lighter, more drought-tolerant plants
    recommendations.push(
      thaiNativePlants.find(p => p.id === 'marigold')!,
      thaiNativePlants.find(p => p.id === 'lemongrass')!,
      thaiNativePlants.find(p => p.id === 'bougainvillea')!
    );
  } else {
    // Ground sites can support larger plants
    if (area >= 100) {
      recommendations.push(
        thaiNativePlants.find(p => p.id === 'frangipani')!,
        thaiNativePlants.find(p => p.id === 'neem')!
      );
    }
    recommendations.push(
      thaiNativePlants.find(p => p.id === 'siam-tulip')!,
      thaiNativePlants.find(p => p.id === 'marigold')!,
      thaiNativePlants.find(p => p.id === 'lemongrass')!
    );
  }
  
  return recommendations;
};
