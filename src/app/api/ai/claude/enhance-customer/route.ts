import { NextRequest, NextResponse } from 'next/server';
import { claudeService } from '@/lib/claudeService';
import { researchService } from '@/lib/researchService';

export async function POST(request: NextRequest) {
  try {
    const { customerDescription, userContext } = await request.json();

    if (!customerDescription) {
      return NextResponse.json(
        { error: 'Customer description is required' },
        { status: 400 }
      );
    }

    // Enhance the customer description using Claude
    const enhancementResult = await claudeService.enhanceCustomerDescription(
      customerDescription,
      userContext
    );

    // Conduct research if user context includes company information
    let researchData = null;
    if (userContext?.companyName) {
      try {
        // Research the user's company and industry
        const [companyResearch, industryResearch] = await Promise.all([
          researchService.researchCompany(userContext.companyName, userContext.companyWebsite),
          researchService.researchIndustry(userContext.industry || 'Business Services', 
                                         `${userContext.city}, ${userContext.state}`)
        ]);

        researchData = {
          company: companyResearch,
          industry: industryResearch
        };
      } catch (researchError) {
        console.error('Research error:', researchError);
        // Continue without research data
      }
    }

    return NextResponse.json({
      ...enhancementResult,
      researchData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Customer enhancement error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enhance customer description' },
      { status: 500 }
    );
  }
}