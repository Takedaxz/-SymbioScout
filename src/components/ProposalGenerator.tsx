'use client';

import { useState } from 'react';
import { DemoSite } from '@/data/demo-sites';
import { PlantingPlan, ImpactMetrics as ImpactMetricsType } from '@/lib/impact-calculator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

interface ProposalGeneratorProps {
  site: DemoSite;
  plantingPlan: PlantingPlan;
  impactMetrics: ImpactMetricsType;
}

export default function ProposalGenerator({ site, plantingPlan, impactMetrics }: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generateProposal = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName: site.name,
          siteDescription: site.description,
          plantPlan: plantingPlan.plants.map(({ plant, quantity }) => 
            `${quantity} x ${plant.name} (${plant.scientificName})`
          ).join(', '),
          impactMetrics: {
            stormwater: impactMetrics.stormwaterReduction.litersPerYear,
            co2: impactMetrics.co2Sequestration.kgPerYear,
            biodiversity: impactMetrics.biodiversitySupport.level
          },
          location: 'Bangkok, Thailand'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate proposal');
      }

      const proposalData = await response.json();
      setProposal(proposalData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating proposal:', error);
      // Fallback proposal if API fails
      setProposal({
        title: `${site.name} Community Greening Project`,
        introduction: `This proposal outlines a plan to transform ${site.name} into a thriving community garden that will provide environmental, social, and economic benefits to the local community.`,
        benefits: `The project will reduce stormwater runoff by ${impactMetrics.stormwaterReduction.litersPerYear} liters annually, sequester ${impactMetrics.co2Sequestration.kgPerYear} kg of CO₂, and support local biodiversity.`,
        implementation: 'Implementation will proceed in phases with community involvement at each step, including site preparation, plant installation, and ongoing maintenance.',
        nextSteps: 'Next steps include securing permissions from local authorities, sourcing plants and materials, and organizing community volunteers.',
        conclusion: 'This project represents an opportunity to create lasting positive change in our community while contributing to urban sustainability goals.'
      });
      setShowPreview(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('proposal-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${site.name.replace(/\s+/g, '_')}_greening_proposal.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!showPreview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Generate Community Proposal</h2>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl">Create a professional proposal to present to community groups and city officials</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600">P</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">Ready to Generate Your Proposal</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              We'll create a comprehensive proposal including project details, environmental benefits,
              and implementation steps that you can share with stakeholders.
            </p>

            <button
              onClick={generateProposal}
              disabled={isGenerating}
              className="btn-primary py-3 px-6 sm:py-4 sm:px-8 lg:py-5 lg:px-12 text-base sm:text-lg lg:text-2xl w-full sm:w-auto"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                  <span className="text-sm sm:text-base lg:text-lg">Generating...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base lg:text-lg">Generate Proposal</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Community Proposal</h2>
        <button
          onClick={downloadPDF}
          className="btn-secondary py-3 px-6 sm:py-4 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
        >
          Download PDF
        </button>
      </div>

      <div id="proposal-preview" className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{proposal.title}</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base text-gray-600">
            <span>{site.name}</span>
            <span className="hidden sm:inline">•</span>
            <span>{new Date().toLocaleDateString()}</span>
            <span className="hidden sm:inline">•</span>
            <span>Bangkok, Thailand</span>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Project Overview</h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown>{proposal.introduction}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Site Details</h2>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                <div>
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="ml-2 text-gray-800 font-medium">{site.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Area:</span>
                  <span className="ml-2 text-gray-800 font-medium">{site.area} m²</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Current Use:</span>
                  <span className="ml-2 text-gray-800 font-medium">{site.currentUse}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Potential:</span>
                  <span className="ml-2 text-gray-800 font-medium">{site.potential}</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Proposed Plant Plan</h2>
            <div className="space-y-3 sm:space-y-4">
              {plantingPlan.plants.map(({ plant, quantity }) => (
                <div key={plant.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-green-50 rounded-lg shadow-sm space-y-1 sm:space-y-0">
                  <div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{plant.name}</span>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">({plant.scientificName})</span>
                  </div>
                  <span className="font-semibold text-green-600 text-sm sm:text-base">{quantity} plants</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Environmental Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {impactMetrics.stormwaterReduction.litersPerYear.toLocaleString()}L
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Stormwater Reduction</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {impactMetrics.co2Sequestration.kgPerYear}kg
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">CO₂ Sequestration</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {impactMetrics.biodiversitySupport.pollinatorSpecies}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Pollinator Species</div>
              </div>
            </div>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown>{proposal.benefits}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Implementation Plan</h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown>{proposal.implementation}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Next Steps</h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown>{proposal.nextSteps}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Conclusion</h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <ReactMarkdown>{proposal.conclusion}</ReactMarkdown>
            </div>
          </section>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/60 text-center text-xs sm:text-sm text-gray-500">
          <p className="text-sm sm:text-base font-medium mb-1">Generated by SymbioScout - AI-Powered Urban Greening Platform</p>
          <p className="text-xs sm:text-sm">For more information, visit our platform or contact local environmental organizations</p>
        </div>
      </div>
    </div>
  );
}
