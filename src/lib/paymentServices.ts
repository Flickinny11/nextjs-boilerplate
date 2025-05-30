import { openRouterService } from "./openRouterService";
import { organizationService } from "./organizationService";

interface PaymentPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
}

interface UserCredits {
  available: number;
  used: number;
  lastUpdated: Date;
}

interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  credits?: number;
}

interface APIUsage {
  model: string;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  timestamp: Date;
}

// Available payment plans
export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    name: '500 Credits',
    credits: 500,
    price: 49.99
  },
  {
    id: 'pro', 
    name: '1,000 Credits',
    credits: 1000,
    price: 89.99
  },
  {
    id: 'enterprise',
    name: '2,500 Credits',
    credits: 2500,
    price: 199.99
  }
];

export class PaymentService {
  private static instance: PaymentService;
  private userCredits: Map<string, UserCredits> = new Map();
  private apiUsageHistory: Map<string, APIUsage[]> = new Map();

  private constructor() {
    // Initialize with demo data
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Process payment and add credits
  async processPayment(userId: string, planId: string): Promise<PaymentResult> {
    try {
      const plan = PAYMENT_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // TODO: Integrate with Stripe
      const transactionId = `txn_${Date.now()}`;

      // Add credits to user's account
      await this.addCredits(userId, plan.credits);

      return {
        success: true,
        message: `Successfully added ${plan.credits} credits`,
        transactionId,
        credits: plan.credits
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        message: 'Failed to process payment'
      };
    }
  }

  // Add credits to user's account
  private async addCredits(userId: string, amount: number): Promise<void> {
    const currentCredits = this.userCredits.get(userId) || {
      available: 0,
      used: 0,
      lastUpdated: new Date()
    };

    this.userCredits.set(userId, {
      ...currentCredits,
      available: currentCredits.available + amount,
      lastUpdated: new Date()
    });
  }

  // Check if user has enough credits  
  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const credits = this.userCredits.get(userId);
    return credits ? credits.available >= required : false;
  }

  // Deduct credits for API usage
  async deductCredits(userId: string, amount: number): Promise<boolean> {
    try {
      const credits = this.userCredits.get(userId);
      if (!credits || credits.available < amount) {
        return false;
      }

      this.userCredits.set(userId, {
        ...credits,
        available: credits.available - amount,
        used: credits.used + amount,
        lastUpdated: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  }

  // Get user's credit balance
  async getCreditBalance(userId: string): Promise<UserCredits> {
    return (
      this.userCredits.get(userId) || {
        available: 0,
        used: 0,
        lastUpdated: new Date()
      }
    );
  }

  // Track OpenRouter API usage with real costs
  async trackOpenRouterUsage(
    userId: string, 
    model: string, 
    promptTokens: number, 
    completionTokens: number,
    organizationId?: string
  ): Promise<void> {
    try {
      // Calculate real cost using OpenRouter pricing
      const cost = openRouterService.calculateCost(model, promptTokens, completionTokens);
      
      // Convert cost to credits (e.g., $0.01 = 1 credit)
      const creditsUsed = Math.ceil(cost * 100);

      // If organization ID provided, use organization billing
      if (organizationId) {
        await organizationService.trackOrganizationUsage(organizationId, userId, creditsUsed, cost);
      } else {
        // Deduct from user's individual credits
        await this.deductCredits(userId, creditsUsed);
      }

      // Track usage history
      const usage: APIUsage = {
        model,
        promptTokens,
        completionTokens,
        cost,
        timestamp: new Date()
      };

      const userHistory = this.apiUsageHistory.get(userId) || [];
      userHistory.push(usage);
      this.apiUsageHistory.set(userId, userHistory);

    } catch (error) {
      console.error('Error tracking OpenRouter usage:', error);
    }
  }

  // Get API usage history
  async getAPIUsageHistory(userId: string): Promise<APIUsage[]> {
    return this.apiUsageHistory.get(userId) || [];
  }

  // Get usage analytics
  async getUsageAnalytics(userId: string): Promise<{
    totalCost: number;
    totalTokens: number;
    modelUsage: Record<string, number>;
  }> {
    const history = this.apiUsageHistory.get(userId) || [];
    
    const totalCost = history.reduce((sum, usage) => sum + usage.cost, 0);
    const totalTokens = history.reduce((sum, usage) => sum + usage.promptTokens + usage.completionTokens, 0);
    
    const modelUsage = history.reduce((acc, usage) => {
      acc[usage.model] = (acc[usage.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCost,
      totalTokens,
      modelUsage
    };
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();
