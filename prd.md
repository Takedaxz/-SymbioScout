# SymbioScout – Product Requirements Document (MVP)

## Objective

SymbioScout is a web-based platform that empowers urban planners and community activists to identify unused urban spaces and generate mini greening projects (biodiversity hubs). The hackathon MVP (Minimum Viable Product) will focus on a simple, functional prototype that demonstrates the core idea: finding an underutilized spot in a city and suggesting a plan to transform it into a green space. The objective is to build a working demo that showcases AI-driven mapping and planning on a small scale, suitable for a hackathon pitch.

## Background & Problem

Cities often have vacant lots, bare roadside verges, or unused rooftops that could be transformed into green areas. However, identifying these spaces and planning ecological projects (like community gardens or micro-forests) usually requires expert analysis and significant effort. Key challenges include: - Lack of Awareness: City residents or officials may not realize how many idle spaces could support greenery. - Knowledge Gap: Designing a biodiversity-friendly garden (e.g., choosing native plants, estimating environmental impact) typically needs ecological expertise. - Resource Intensive Planning: Consulting and site analyses are expensive and time-consuming, which is a barrier for community groups with limited budgets.

SymbioScout aims to address these issues by providing an AI-powered tool that automatically scouts for greening opportunities and streamlines the planning process. This aligns with several Sustainable Development Goals (SDGs), especially SDG 15: Life on Land, by fostering urban biodiversity, and SDG 11: Sustainable Cities and Communities, by making cities greener and more resilient.

## Solution Overview

SymbioScout is envisioned as a web application (mobile-friendly) where users can: 1. Select a City Area: Define a neighborhood or district on an interactive map. 2. Discover Opportunities: Use AI (computer vision on aerial imagery) to highlight underutilized spaces (vacant lots, empty rooftops, etc.) suitable for green projects. 3. Generate a Greening Plan: For a chosen space, get a recommendation of native plant species to introduce, with a design layout suggestion. 4. See Impact Estimates: View a simple dashboard of predicted environmental benefits (e.g., how much rainwater runoff can be absorbed, or CO₂ reduced). 5. Share the Proposal: Compile this information into a brief, shareable format (e.g., a mini report or image) to help in pitching the project to communities or officials.

In the MVP, we will demonstrate a simplified version of this flow. The focus is on one or two core scenarios (for example, identifying one vacant lot and producing a basic greening plan for it), rather than covering an entire city.

## Scope of MVP

For the hackathon, the scope is limited to implementing the most essential features needed to prove the concept: - Geographic Focus: MVP will target a single city or a specific district where suitable open data is available (for example, using one city’s satellite map and known vacant lots). This keeps the AI analysis and data needs manageable. - Core Features Only: We will implement the basic workflow – from selecting a site to viewing a proposed plan and impact stats. Advanced features like detailed editing of plans or multi-site comparisons are out of scope. - AI Approach (Simplified): Instead of training a complex new computer vision model in a short time, the MVP will use a pre-existing AI service or API (e.g., OpenAI API or a small pre-trained model) to simulate the intelligence: - We might hard-code or manually identify one example vacant space to showcase the “AI found it” aspect. - We will use an AI (via OpenAI API) to generate or refine content, such as the list of plants or the wording of the proposal, to save time on development. - Deployment & Tech Constraints: The solution will be lightweight and easy to deploy (e.g., a frontend on Vercel with minimal backend), appropriate for a hackathon setting. No complex IoT or hardware components — it will rely purely on software and available data.
### Out of Scope (for MVP)

Land ownership verification, real-time satellite analysis for an entire city, a comprehensive database of all cities, and full automation of all processes. These are noted as future enhancements but will not be built during the hackathon.

## Key Features and MVP Implementation

### 1. AI Opportunity Mapping

**Feature Description:** Identify and map potential locations for urban greening projects using aerial imagery and AI analysis. In the full vision, this would highlight spots like vacant lots, rooftops, or unused parcels automatically.

**MVP Implementation:**
- Use a mapping interface (e.g., Mapbox GL or Google Maps embedded map) to display a chosen area.
- For the MVP demo, one or two pre-identified unused sites in the area will be highlighted on the map (simulating the AI detection). For example, a vacant lot or an open rooftop in the chosen district will be marked.
- Clicking on the highlighted spot will select it for further action. This triggers the next steps (plan generation).

**Simplification:** Rather than building a custom computer vision model from scratch, the hackathon prototype can use an existing dataset or manual annotation for a couple of example sites. We might prepare geo-coordinates of a known empty lot. If time permits and data is available, we could integrate a basic call to a service like Google Maps API to detect green vs. non-green areas, but it’s not mandatory for MVP. The main goal is to show “Here’s a spot the AI found.”

### 2. Native Species Plan Generator

**Feature Description:** Once a location is selected, provide recommendations for an optimal mix of native plants, trees, or shrubs suited to that space. These recommendations align with the project’s ecological goals (pollinator-friendly, air quality improvement, etc.).

**MVP Implementation:**
- Prepare a small database of native plant species for the target region (could be as simple as a JSON file with plant names, types, and benefits). For example, if the demo city is Bangkok, list a few native flowering plants, a tree, a shrub known to do well in that climate.
- When the user selects the site, the system will generate a suggested planting plan. To make this intelligent without complex algorithms:
  - Use rules of thumb (e.g., if the area is a sunny open lot of ~100 m², suggest a mix of 2 trees, 50 shrubs, and 200 smaller plants).
  - Leverage OpenAI API: We can feed the basic context (location, size, goal) into a prompt for GPT-4 to get a nicely formatted suggestion. For example, “Suggest a list of native plants (with quantities) for a community garden in an empty 100 m² lot in [City]. Focus on pollinator-friendly choices.” The AI can return a creative list and short descriptions.
- The output will be a list of recommended species (e.g., 3 Neem trees, 20 Lavender bushes, 50 native wildflower plants) and possibly short notes on each (like “Lavender – attracts pollinators like bees”).
- The focus is on simplicity and clarity – the user should immediately grasp what to plant and why.

**Note:** This approach avoids needing a large, custom plant recommendation engine. The OpenAI text generation will handle the reasoning and formatting, using its trained knowledge of ecology and native plants. We will verify the suggestions quickly for plausibility.

### 3. Predictive Impact Estimates

**Feature Description:** Provide an estimate of the ecological impact of the proposed greening project. In a full product, this might be a rich dashboard. For MVP, it will be a small summary of key metrics:
- Stormwater Runoff Reduction: How much rainwater could this garden absorb or divert? (In liters per year, for example)
- Carbon Sequestration: How much CO₂ could the plants sequester per year (in kilograms)?
- Biodiversity Support: A qualitative score or simple indicator of how this project supports local biodiversity (e.g., high, medium, low).

**MVP Implementation:**
- Use simple formulas and assumptions for calculations:
  - For stormwater: assume a certain area of garden absorbs a percentage of rainfall. For instance, a 100 m² rain garden might capture thousands of liters of water annually that would otherwise runoff[1]. We can hardcode an estimate (e.g., X liters/year based on average rainfall in the area).
  - For carbon: approximate per tree and per m² sequestration. Example: a mature tree absorbs ~20 kg CO₂/year[1]. If the plan has 3 trees and many plants, maybe the site sequesters ~60–100 kg CO₂/year.
  - Biodiversity support: since precise calculation is complex, for MVP we can output a simple score or statement (like “High: expected to support dozens of pollinator species”).
- These calculations can be done in the backend or even directly in the frontend script since the numbers are straightforward. We will clearly document assumptions (e.g., “Assuming 1 tree = 20 kg CO₂/year, 1 m² garden = 5 liters of water absorbed per heavy rain” etc.).
- The results are displayed in an “Impact” section for the selected site. For clarity, we will present them with icons or bold text (e.g., a water drop icon with “~5000 L of runoff absorbed/year”, a cloud icon with “~80 kg CO₂ captured/year”, a bee icon with “High pollinator support”).

**Accuracy vs. Simplicity:** We acknowledge these are rough estimates. The goal is to make the benefits tangible for a demo. In a future version, these could be refined with more complex models or localized data, but for the hackathon a rough estimation is sufficient to get the idea across.

### 4. Community Action Toolkit (Proposal Generation)

**Feature Description:** Enable users to easily share and act on the plan. This typically includes generating a project proposal or summary that can be presented to community members, potential sponsors, or city officials.

**MVP Implementation:**
- Provide a “Generate Proposal” button once the plan and impacts are ready. Clicking it will compile the information into a presentable format.
- The simplest format: a one-page PDF or image export containing:
  - A map snapshot of the location (showing where the project is).
  - A list of the recommended plants/trees.
  - The impact summary (from feature 3).
  - A short mission statement or description of the project (why it’s important).
- We can use HTML/CSS to layout this "proposal page" and then use a library (or browser print to PDF) for exporting. For the hackathon, even a nicely styled section that the user can screenshot during the demo might suffice.
- OpenAI API can also help here by generating a brief introduction text for the proposal. For example, “This proposal outlines a plan to transform the vacant lot at 123 Main St into a vibrant pollinator garden. By doing so, we aim to... (benefits)….” – the AI can draft a compelling summary given the data, which we then display.
- Include a note or placeholder in the proposal about next steps (e.g., “Next Steps: Check land ownership and obtain permissions from the city council.”) as a disclaimer that further action is required outside the platform. This addresses the known limitation that the tool doesn’t handle legal or ownership issues.

The outcome is that a user (or our team in the demo) can show this proposal as part of the pitch, illustrating how SymbioScout makes it easy to go from idea to action plan in minutes.

## Tech Stack & Architecture

**Overall Approach:** Keep the tech simple and focused on quick development and deployment. We choose tools that are easy to integrate and require minimal setup:
- **Frontend:** A single-page application built with React (or Next.js). This will handle the map interface and displaying results. Next.js is a good choice since Vercel deployment is seamless, and it allows serverless API routes if needed.
- **Mapping Library:** Use Mapbox GL JS or Leaflet with an OpenStreetMap basemap for displaying the city map. Alternatively, Google Maps API (satellite layer) can be used if we want real satellite imagery; however, that may require an API key and has usage limits. Mapbox with a satellite tileset is another option. For MVP, even a static image or a very basic map with a marker could work if time is short.
- **AI and Backend:** We avoid training new models. Instead:
  - Use OpenAI API (GPT-3.5/4) for generating text content (plant lists, descriptions, proposal text). This will be done via simple API calls from either the frontend (if public exposure of API key is handled securely) or via a small backend proxy.
  - If we attempt any image analysis (optional), we might use a cloud vision API (like Google Cloud Vision or a lightweight pre-trained model) to identify green areas vs. concrete. But given the time, we might skip actual CV and use prepared data.
- **Backend logic:** If needed, implement a few serverless functions (Next.js API routes or Node/Express on Vercel) to handle:
  - Calling the OpenAI API (to keep the key secret).
  - Any heavy computation (though our calculations are simple, mostly done in JS).
  - Generating the PDF (we could also do this on the client side).
- **Database:** Not strictly required for the MVP. Any static data (like the native plants list) can be hard-coded or stored as a JSON. If we need to store anything (e.g., user selections or generated plans), a simple in-memory or file-based store is fine for demo purposes.
- **Deployment:** Vercel will host the app (both frontend and backend if using Next.js). This makes it easy to share the live demo. The team can also show it locally if internet is an issue, since the app will be lightweight.
- **APIs & Keys:** We will secure any API keys (Mapbox, OpenAI) properly. For hackathon demo, it's okay to include them in environment variables. Rate limiting should not be an issue with low demo usage, but we’ll have a plan B (like static content) if API calls fail.

**Architecture Diagram:** (If needed, we can include a simple diagram in the PRD/presentation). The architecture is straightforward:
1.  **Client (Browser)** – Loads the map and UI, triggers actions.
2.  **Serverless Functions (Vercel)** – Receives requests for AI generation or data fetching, returns results.
3.  **Third-Party Services:**
    - OpenAI API for intelligent text generation.
    - Map tile service (Mapbox/Google) for map imagery.
    - (Optional) any vision API if used for detection.

This simplicity ensures that we can build the MVP quickly and reliably within the hackathon timeframe.

## User Journey & Demo Scenario

To illustrate how SymbioScout works, consider the following demo scenario that we will use during the pitch:

1.  **User (Planner/Activist) Opens SymbioScout:** The demo starts with the SymbioScout web app showing a map of the chosen city district (for example, a part of Bangkok city).
2.  **Define Area of Interest:** The user draws a rough boundary or selects a neighborhood from a dropdown (for MVP, this could be simulated or pre-set to our demo area).
3.  **AI Highlights a Vacant Space:** On the map, an empty lot (e.g., a vacant plot next to a school) is highlighted. The narrator explains, “SymbioScout’s AI has scanned the area and found this underused space.” In MVP, this highlight is pre-defined for the demo.
4.  **View Site Details:** The user clicks the highlighted spot. A sidebar or popup appears with basic info: “Location: 123 Example Street – Currently an unused paved lot of ~100 m².”
5.  **Generate Plan:** The user clicks “Generate Greening Plan”. In real-time, the app calls the AI and quickly returns:
    - A list of native plants for that lot (e.g., “3 Frangipani trees, 20 Siam Tulip plants, and a mix of native wildflowers like Sunflowers and Marigold”).
    - A brief note: “These species are drought-tolerant and attract local butterflies and bees.”
6.  This appears on the interface clearly. The user is delighted to see a plan without any manual research.
7.  **Show Impact Estimates:** The app then displays the Impact section:
    - Stormwater absorption: ~5,000 liters/year (helping reduce neighborhood flooding)[1].
    - Carbon reduction: ~80 kg CO₂ sequestered/year (equivalent to taking a car off the road for 3 months).
    - Biodiversity: High – supports pollinators and birds.
8.  These numbers are shown with small icons and maybe a tooltip explaining them.
9.  **User Generates Proposal:** Satisfied, the user hits “Create Proposal”. The app compiles a one-page summary. For the demo, we will show this as either a new screen or a PDF:
    - It includes a map snapshot of the lot, the plant list, the impact stats, and a nice descriptive paragraph. Possibly something like: “Transforming the vacant lot at 123 Example Street into a thriving pollinator garden will create a green haven in the city. The garden will capture rainwater runoff, improve air quality, and provide habitat for local wildlife.”
    - (This text can be AI-generated beforehand and tweaked to fit nicely on the page.)
10. **Wrap Up:** The user (or our team) concludes by saying now they have a concrete proposal to take to the community or city council. SymbioScout did in minutes what might otherwise take weeks of analysis.

During the live pitch, we will walk through these steps in real-time to show the MVP in action. We’ll prepare the scenario so it runs smoothly (e.g., ensure the AI calls respond quickly, possibly cache the results to avoid delays).

**Pitch Angle:** Emphasize how easy and fast it was to go from nothing to a full plan using SymbioScout. Also mention the broader vision that if we had more time/data, the same process could be scaled to find dozens of sites and quickly green an entire city area.

## Challenges & Considerations

While building SymbioScout (even just the MVP), we are aware of certain challenges and how we address them:

-   **Data Availability & Resolution:** High-resolution satellite imagery or maps are crucial to identify small urban spaces. For the hackathon, we mitigate this by focusing on a location with known good imagery (using Google’s or open data for one city). If imagery is low-res, our demo will stick to obvious larger sites. **Solution:** Use readily available map APIs and manually mark one spot for the demo (so we’re not stuck if the AI detection part is tricky).
-   **AI Model Complexity:** Training a custom model to detect vacant land is not feasible in a hackathon timeframe. **Solution:** Use a proxy approach: e.g., OpenAI’s API for generating results, or pre-tag a site as mentioned. We’ll explain that a more robust model (maybe using semantic segmentation on aerial images[2]) can be integrated later.
-   **Land Ownership & Permissions:** SymbioScout can suggest using a space, but it doesn’t know if it’s privately owned or if local laws allow converting it to a garden. This is a real-world hurdle. **Solution:** In the proposal or app, include a disclaimer and a “Next Steps” guide for users (like “Check land ownership on city registry; seek permission”). During the demo, we’ll mention that this tool equips users with data to approach authorities, but it doesn’t bypass regulations.
-   **Accuracy of Impact Metrics:** The environmental benefits are estimates. Different sources might give different numbers (e.g., tree CO₂ absorption rates). **Solution:** Use conservative, cited estimates for credibility. Clearly state assumptions. Since it’s an MVP, precision is less critical than showing that metrics can be provided. In a real product, we’d collaborate with ecologists for accuracy.
-   **Time Constraint (Hackathon):** Building even the MVP in the limited hackathon period is challenging. We must prioritize features that convey the idea. **Solution:** We have scoped down the project to the essentials (mapping one site, generating text and numbers, simple UI). We’ll use as many off-the-shelf solutions as possible (APIs, libraries) to save time. Also, tasks will be divided among team members in parallel (one works on frontend UI, one on AI integration, etc.).

By being mindful of these challenges, we ensure our demo is realistic and transparent about what’s done and what is aspirational.

## Potential Impact

Even at MVP stage, SymbioScout’s concept has significant implications:
- **Empowering Communities:** Local groups with no access to expert planners can initiate greening projects with reliable data in hand. This democratizes urban planning for sustainability.
- **Environmental Benefits:** If scaled, many small green patches can collectively form a network of urban biodiversity hotspots. This improves habitat connectivity for species like birds and pollinators in the city. More green coverage also helps clean the air and lower city temperatures (mitigating urban heat island effect).
- **Climate Resilience:** Green spaces absorb rainwater, reducing flooding risk, and sequester carbon, contributing to climate mitigation. Even a single rain garden can make a local difference in stormwater management[1].
- **Inspiration for Policy:** Showcasing several community-initiated projects might encourage city officials to adopt policies for turning unused land into parks or gardens, aligning with SDG goals for sustainable cities.
- **Education and Awareness:** The platform (and our hackathon demo) can spark conversations about how much idle potential our cities have. It visualizes an optimistic future where every bit of forgotten land can be transformed into something beneficial.

In the hackathon pitch, we will highlight these impacts, backed by the small example we demonstrate. It shows the judges and audience that our MVP, if developed further, can truly make cities greener and improve quality of life.

## Future Enhancements

Given more time and resources beyond the hackathon, SymbioScout could expand in many ways:
- **Automated AI Detection:** Train a dedicated deep learning model on high-res satellite imagery to identify various types of underutilized spaces (rooftops, parking lots, medians, etc.) with high accuracy[2]. This would remove the need for any manual tagging.
- **Larger Database & Customization:** Expand the plant recommendation database to include many regions and allow users to set specific goals (e.g., “maximize urban farming” or “primarily for shade”). The AI could then tailor plans for edible gardens (supporting SDG 2: Zero Hunger) or energy-saving green roofs (supporting SDG 7: Clean Energy via reduced AC usage).
- **User Contributions:** Enable community users to add data – e.g., flag a new site, upload a photo of a vacant lot, or share results after they implement a project. This can keep information up-to-date and increase engagement.
- **Collaboration Features:** The Community Toolkit could evolve into a collaboration platform where people can form project teams, assign tasks, seek volunteers or funding, and track progress of converting a site.
- **Integration with City Systems:** Incorporate city zoning data or land ownership databases to filter out sites that are not feasible (e.g., privately owned land might show a warning or required process to get permission).
- **Mobile App:** While the web app is mobile-friendly, a dedicated mobile app could use GPS to let users scout their surroundings in real-time (e.g., walking by an empty lot and using SymbioScout to scan it instantly).
- **AR Visualization:** Future tech addition could be using Augmented Reality to visualize proposed greenery on-site through a phone camera – this is beyond MVP but a compelling idea for community engagement.
- **Robust Impact Analytics:** Refine the impact models with research-backed data. Possibly integrate with climate data APIs to adjust runoff or CO₂ figures based on local conditions, making the dashboard credible enough for grant applications or official reports.

Each of these features can be tied to the broader vision of turning SymbioScout from a prototype into a full-fledged platform. They are not in our MVP, but they show a roadmap. This demonstrates to hackathon judges that we’ve thought about long-term value and technical scalability.

## Conclusion

The SymbioScout MVP will demonstrate the core value proposition: using AI and simple web tools to convert urban observations into actionable green plans. In the hackathon demo, we’ll showcase how a single underused space can be identified and reimagined in moments. The PRD above outlines how we’ll build this MVP, the assumptions made, and how we’ll present it. Ultimately, SymbioScout has the potential to accelerate urban greening initiatives and empower communities worldwide – starting with this small but powerful prototype.

---

[1] An evaluation of the stormwater runoff reduction of two distinct tree ...
<https://www.sciencedirect.com/science/article/pii/S1618866725001268>

[2] Large-scale automatic identification of urban vacant land using ...
<https://www.sciencedirect.com/science/article/abs/pii/S0169204622000330>
