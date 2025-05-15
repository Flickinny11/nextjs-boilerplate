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
  private apiCredits: Map<string, number> = new Map();
  private userCredits: Map<string, UserCredits> = new Map();

  private constructor() {
    // Initialize with some default values for demo
    this.apiCredits.set('openai', 1000);
    this.apiCredits.set('anthropic', 1000);
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

      // TODO: Integrate with actual payment processor (Stripe, etc.)
      // For now, simulate a successful payment
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

  // Auto-replenish API credits when running low
  async checkAndReplenishAPICredits(service: 'openai' | 'anthropic'): Promise<void> {
    const currentCredits = this.apiCredits.get(service) || 0;
    const threshold = 100; // Replenish when credits fall below this number

    if (currentCredits < threshold) {
      try {
        // TODO: Implement actual API credit purchase logic
        // For now, just simulate adding more credits
        this.apiCredits.set(service, currentCredits + 1000);
        console.log(`Replenished ${service} API credits`);
      } catch (error) {
        console.error(`Failed to replenish ${service} API credits:`, error);
      }
    }
  }

  // Track API usage
  async trackAPIUsage(userId: string, service: 'openai' | 'anthropic', creditsUsed: number): Promise<void> {
    try {
      // Deduct from user's credits
      await this.deductCredits(userId, creditsUsed);

      // Deduct from API service credits
      const currentApiCredits = this.apiCredits.get(service) || 0;
      this.apiCredits.set(service, currentApiCredits - creditsUsed);

      // Check if we need to replenish API credits
      await this.checkAndReplenishAPICredits(service);
    } catch (error) {
      console.error('Error tracking API usage:', error);
    }
  }

  // Get API credit balance
  async getAPICredits(service: 'openai' | 'anthropic'): Promise<number> {
    return this.apiCredits.get(service) || 0;
  }
}

// Export a singleton instance
export const paymentService = PaymentService.getInstance();
