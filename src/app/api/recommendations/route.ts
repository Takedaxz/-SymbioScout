import { NextRequest, NextResponse } from 'next/server';
import { generatePlantRecommendations, PlantRecommendationRequest } from '@/lib/openai-client';

export async function POST(request: NextRequest) {
  try {
    const body: PlantRecommendationRequest = await request.json();
    
    // Validate required fields
    if (!body.siteDescription || !body.area || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recommendations = await generatePlantRecommendations(body);
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
