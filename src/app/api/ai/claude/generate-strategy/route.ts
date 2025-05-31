import { NextRequest, NextResponse } from 'next/server';
import { claudeService } from '@/lib/claudeService';
import { researchService } from '@/lib/researchService';

export async function POST(request: NextRequest) {
  try {
    const { customerDescription, userContext, preferences = {} } = await request.json();

    if (!customerDescription) {
      return NextResponse.json(
        { error: 'Customer description is required' },
        { status: 400 }
      );
    }

    // Generate comprehensive marketing strategy
    const strategyResult = await claudeService.generateMarketingStrategy(
      customerDescription,
      userContext,
      preferences
    );

    // Generate marketing content if we have content parameters
    let contentResult = null;
    if (strategyResult.contentRequest) {
      try {
        const contentResponse = await fetch(`${process.env.NEXTJS_URL || 'http://localhost:3000'}/api/content/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(strategyResult.contentRequest),
        });

        if (contentResponse.ok) {
          contentResult = await contentResponse.json();
        }
      } catch (error) {
        console.error('Content generation error:', error);
      }
    }

    // Conduct competitive analysis if user context includes industry
    let competitorAnalysis = null;
    if (userContext?.industry) {
      try {
        competitorAnalysis = await researchService.analyzeCompetitors(
          userContext.industry,
          `${userContext.city}, ${userContext.state}`,
          userContext.companySize
        );
      } catch (error) {
        console.error('Competitor analysis error:', error);
      }
    }

    // Find potential leads if targeting information is available
    let potentialLeads = null;
    if (userContext?.industry && preferences.targetJobTitles) {
      try {
        potentialLeads = await researchService.findPotentialLeads(
          userContext.industry,
          preferences.targetJobTitles,
          `${userContext.city}, ${userContext.state}`,
          preferences.targetCompanySize
        );
      } catch (error) {
        console.error('Lead research error:', error);
      }
    }

    return NextResponse.json({
      ...strategyResult,
      competitorAnalysis,
      potentialLeads,
      contentResult,
      recommendations: {
        nextSteps: [
          'Review and approve the marketing strategy',
          'Examine generated marketing materials',
          'Set up initial content creation',
          'Configure lead capture automation',
          'Launch pilot campaign'
        ],
        priorityActions: strategyResult.actionItems
          .filter(item => item.priority === 'high')
          .slice(0, 3)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Strategy generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate marketing strategy' },
      { status: 500 }
    );
  }
}