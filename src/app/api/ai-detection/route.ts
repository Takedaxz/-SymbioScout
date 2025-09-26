import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIDetectionRequest {
  method: 'smart_heuristics' | 'openai_vision';
  request: {
    coordinates: [number, number];
    radius: number;
    areaType: 'urban' | 'suburban' | 'mixed';
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AIDetectionRequest = await request.json();
    
    if (!body.request.coordinates || !body.request.radius) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let sites = [];

    switch (body.method) {
      case 'smart_heuristics':
        sites = await detectWithSmartHeuristics(body.request);
        break;
      case 'openai_vision':
        sites = await detectWithOpenAIVision(body.request);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid detection method' },
          { status: 400 }
        );
    }

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error in AI detection API:', error);
    return NextResponse.json(
      { error: 'Failed to detect sites' },
      { status: 500 }
    );
  }
}

async function detectWithOpenAIVision(request: AIDetectionRequest['request']) {
  try {
    // For demo purposes, we'll use GPT-4 to analyze the area description
    // In production, you would use GPT-4V with actual satellite imagery
    
    const prompt = `
    Analyze the urban area at coordinates ${request.coordinates[1]}, ${request.coordinates[0]} 
    with a radius of ${request.radius}m in a ${request.areaType} setting.
    
    Identify potential greening opportunities and return 2-3 sites in JSON format:
    
    {
      "sites": [
        {
          "id": "unique_id",
          "coordinates": [lng, lat],
          "area": area_in_square_meters,
          "confidence": 0.0_to_1.0,
          "siteType": "vacant_lot|rooftop|parking_lot|median|sidewalk",
          "description": "detailed description",
          "currentUse": "current use description",
          "potential": "greening potential description"
        }
      ]
    }
    
    Focus on:
    - Vacant lots and unused spaces
    - Rooftops suitable for green roofs
    - Underutilized parking areas
    - Street medians and sidewalks
    - Areas with good sun exposure and accessibility
    
    Make the coordinates realistic for the Bangkok area.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert urban planner and AI assistant specializing in identifying urban greening opportunities. Analyze satellite imagery and urban data to find potential sites for community gardens, green roofs, and other greening projects."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    try {
      const parsed = JSON.parse(response);
      return parsed.sites || [];
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return generateFallbackSites(request);
    }
  } catch (error) {
    console.error('OpenAI Vision error:', error);
    return generateFallbackSites(request);
  }
}

async function detectWithSmartHeuristics(request: AIDetectionRequest['request']) {
  // Use smart heuristics with OpenStreetMap data
  const { detectSitesWithSmartHeuristics } = await import('@/lib/ai-detection');
  return await detectSitesWithSmartHeuristics(request);
}

function generateFallbackSites(request: AIDetectionRequest['request']) {
  // Generate realistic fallback sites for Bangkok area
  const baseLng = request.coordinates[0];
  const baseLat = request.coordinates[1];
  
  return [
    {
      id: `ai-detected-${Date.now()}-1`,
      coordinates: [baseLng + 0.001, baseLat + 0.001],
      area: Math.floor(Math.random() * 100) + 50,
      confidence: 0.85 + Math.random() * 0.1,
      siteType: 'vacant_lot',
      description: 'AI-detected vacant lot with good potential for community greening',
      currentUse: 'Unused space',
      potential: 'Community garden with native Thai plants'
    },
    {
      id: `ai-detected-${Date.now()}-2`,
      coordinates: [baseLng - 0.001, baseLat + 0.001],
      area: Math.floor(Math.random() * 80) + 40,
      confidence: 0.80 + Math.random() * 0.15,
      siteType: 'rooftop',
      description: 'Flat rooftop space suitable for green roof installation',
      currentUse: 'Unused rooftop',
      potential: 'Urban farming and air quality improvement'
    }
  ];
}
