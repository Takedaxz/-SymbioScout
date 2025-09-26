import { NextRequest, NextResponse } from 'next/server';
import { generateProposal, ProposalRequest } from '@/lib/openai-client';

export async function POST(request: NextRequest) {
  try {
    const body: ProposalRequest = await request.json();
    
    // Validate required fields
    if (!body.siteName || !body.siteDescription || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const proposal = await generateProposal(body);
    
    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error in proposal API:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
