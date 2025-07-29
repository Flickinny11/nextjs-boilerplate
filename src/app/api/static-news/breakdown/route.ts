import { NextRequest, NextResponse } from 'next/server';
import { staticNewsSystem } from '../../../../../core/static_news_system';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { anchorId, userId } = await request.json();
    
    const breakdownPrice = parseFloat(process.env.BREAKDOWN_PRICE || '4.99');
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(breakdownPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        type: 'breakdown_trigger',
        anchorId: anchorId || 'unknown',
        userId: userId || 'anonymous'
      },
      description: `Anchor Breakdown Trigger - ${anchorId || 'Random Anchor'}`
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        amount: breakdownPrice,
        anchorId,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Error creating breakdown payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { paymentIntentId, anchorId, userId } = await request.json();
    
    // Verify payment was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Trigger the breakdown
      const result = staticNewsSystem.triggerBreakdown(anchorId, userId);
      
      return NextResponse.json({
        success: true,
        data: {
          breakdownTriggered: result.success,
          cost: result.cost,
          revenueEvent: result.revenueEvent,
          message: result.success 
            ? 'Breakdown successfully triggered! Watch the chaos unfold!' 
            : 'Anchor is already having a breakdown. Please try again later.'
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing breakdown:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process breakdown' },
      { status: 500 }
    );
  }
}