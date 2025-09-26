import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PlantRecommendationRequest {
  siteDescription: string;
  area: number;
  siteType: 'rooftop' | 'ground';
  location: string;
  goals: string[];
}

export interface PlantRecommendationResponse {
  recommendations: string;
  rationale: string;
  maintenance: string;
  timeline: string;
}

export interface ProposalRequest {
  siteName: string;
  siteDescription: string;
  plantPlan: string;
  impactMetrics: {
    stormwater: number;
    co2: number;
    biodiversity: string;
  };
  location: string;
}

export interface ProposalResponse {
  title: string;
  introduction: string;
  benefits: string;
  implementation: string;
  nextSteps: string;
  conclusion: string;
}

export const generatePlantRecommendations = async (
  request: PlantRecommendationRequest
): Promise<PlantRecommendationResponse> => {
  try {
    const prompt = `
You are an expert urban ecologist and landscape designer specializing in tropical climates, particularly Thailand and Southeast Asia.

Site Details:
- Location: ${request.location}
- Area: ${request.area} square meters
- Site Type: ${request.siteType}
- Description: ${request.siteDescription}
- Goals: ${request.goals.join(', ')}

Please provide a comprehensive plant recommendation that includes:

1. Specific native Thai plant species suitable for this site
2. Rationale for plant selection (considering climate, soil, maintenance, and ecological benefits)
3. Basic maintenance requirements
4. Implementation timeline

Focus on:
- Native Thai plants that thrive in tropical climates
- Plants that support local biodiversity and pollinators
- Low-maintenance options suitable for community gardens
- Plants that provide multiple benefits (air purification, stormwater management, aesthetic value)

Keep the response practical and actionable for community groups.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert urban ecologist and landscape designer specializing in tropical climates and community greening projects."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response into structured format
    const sections = response.split('\n\n');
    
    return {
      recommendations: sections[0] || response,
      rationale: sections[1] || 'Plants selected for their suitability to the local climate and ecological benefits.',
      maintenance: sections[2] || 'Regular watering during dry season, occasional pruning, and seasonal mulching.',
      timeline: sections[3] || 'Implementation can begin immediately with proper site preparation and plant sourcing.'
    };
  } catch (error) {
    console.error('Error generating plant recommendations:', error);
    throw new Error('Failed to generate plant recommendations');
  }
};

export const generateProposal = async (
  request: ProposalRequest
): Promise<ProposalResponse> => {
  try {
    const prompt = `
You are writing a community greening project proposal for urban planners and community groups.

Project Details:
- Site Name: ${request.siteName}
- Location: ${request.location}
- Site Description: ${request.siteDescription}
- Plant Plan: ${request.plantPlan}
- Environmental Impact:
  - Stormwater Reduction: ${request.impactMetrics.stormwater} liters per year
  - CO2 Sequestration: ${request.impactMetrics.co2} kg per year
  - Biodiversity Support: ${request.impactMetrics.biodiversity}

Please create a compelling proposal that includes:

1. A compelling title (just the title text, no formatting)
2. An engaging introduction explaining the project's importance (use markdown for formatting if needed)
3. A benefits section highlighting environmental and community benefits (use markdown for formatting if needed)
4. An implementation plan with practical steps (use markdown for formatting if needed)
5. Next steps for moving forward (use markdown for formatting if needed)
6. A strong conclusion (use markdown for formatting if needed)

IMPORTANT: For the title, provide ONLY the title text without any markdown formatting, prefixes like "Title:", or special characters. The title should be clean and professional.

The tone should be professional yet accessible, suitable for presenting to community groups, city officials, or potential funders. Emphasize the environmental benefits, community engagement opportunities, and alignment with sustainable development goals.

Keep each section concise but impactful.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional urban planning consultant and community engagement specialist writing project proposals for urban greening initiatives."
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
    
    // Parse the response into structured format
    const sections = response.split('\n\n');
    
    return {
      title: sections[0]?.replace(/^#+\s*/, '').replace(/^\*\*.*?\*\*:\s*/, '').replace(/\*\*/g, '').trim() || `${request.siteName} Community Greening Project`,
      introduction: sections[1] || 'This proposal outlines a plan to transform an underutilized urban space into a thriving community garden.',
      benefits: sections[2] || 'The project will provide environmental, social, and economic benefits to the community.',
      implementation: sections[3] || 'Implementation will proceed in phases with community involvement at each step.',
      nextSteps: sections[4] || 'Next steps include securing permissions, sourcing materials, and organizing community volunteers.',
      conclusion: sections[5] || 'This project represents an opportunity to create lasting positive change in our community.'
    };
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw new Error('Failed to generate proposal');
  }
};
