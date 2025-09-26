# SymbioScout - AI-Powered Urban Greening Platform

SymbioScout is a web-based platform that empowers urban planners and community activists to identify unused urban spaces and generate mini greening projects (biodiversity hubs).

## Features

- **AI Opportunity Mapping**: Interactive map showing potential greening sites
- **Native Species Plan Generator**: AI-powered plant recommendations for selected sites
- **Predictive Impact Estimates**: Calculate environmental benefits (stormwater, CO2, biodiversity)
- **Community Action Toolkit**: Generate shareable proposals for stakeholders

## Tech Stack

- **Frontend**: Next.js 15 with React 18 and TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS with satellite imagery
- **AI**: OpenAI API for content generation
- **PDF Generation**: jsPDF with html2canvas
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get API Keys

#### Mapbox API Key
1. Sign up at [Mapbox.com](https://www.mapbox.com)
2. Go to Account → Access Tokens
3. Create a new token or use the default public token

#### OpenAI API Key
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Go to API Keys
3. Create a new secret key

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Demo Scenario

The application includes a demo scenario set in Bangkok, Thailand with:

1. **Site Selection**: Two pre-configured demo sites (Wat Pho Community Garden Site and Chinatown Rooftop Garden)
2. **Plant Recommendations**: Native Thai plants suitable for tropical climates
3. **Impact Analysis**: Environmental benefits calculations
4. **Proposal Generation**: AI-generated community proposals with PDF export

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── recommendations/
│   │   └── proposal/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── MapComponent.tsx
│   ├── SiteDetails.tsx
│   ├── PlantRecommendations.tsx
│   ├── ImpactMetrics.tsx
│   └── ProposalGenerator.tsx
├── data/                  # Static data
│   ├── demo-sites.ts
│   └── plants-database.ts
└── lib/                   # Utility functions
    ├── impact-calculator.ts
    └── openai-client.ts
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add the following environment variables in your deployment platform:

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `OPENAI_API_KEY`

## Features Overview

### 1. Interactive Mapping
- Mapbox integration with satellite imagery
- Pre-configured demo sites in Bangkok
- Click-to-select site functionality

### 2. AI Plant Recommendations
- Native Thai plant database
- Site-specific recommendations based on area and type
- Detailed plant information including benefits and care instructions

### 3. Impact Calculations
- Stormwater runoff reduction estimates
- CO2 sequestration calculations
- Biodiversity support assessment
- Air quality improvement metrics

### 4. Proposal Generation
- AI-generated community proposals
- Professional formatting
- PDF export functionality
- Stakeholder-ready content

## Contributing

This is a hackathon project. For production use, consider:

- Adding user authentication
- Implementing a proper database
- Expanding plant databases for other regions
- Adding more sophisticated AI models
- Implementing real-time satellite analysis

## License

This project is created for educational and demonstration purposes.
