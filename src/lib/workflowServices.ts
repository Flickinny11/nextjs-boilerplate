import { Lead } from "./aiServices";
import { TextContent, ImageContent, VideoContent } from "./marketingServices";

// Types for workflow automation
export type WorkflowStepType = "email" | "sms" | "social" | "wait" | "condition" | "action";

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  details: any;
  position: number;
  nextSteps?: string[];
}

export interface WorkflowTrigger {
  id: string;
  type: string; 
  conditions: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  createdAt: Date;
  updatedAt: Date;
  creator: string;
  targetAudience?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: Date;
  status: "running" | "completed" | "failed" | "paused";
  currentStep?: string;
  targetLeads: string[];
  results: WorkflowStepResult[];
}

export interface WorkflowStepResult {
  stepId: string;
  startedAt: Date;
  completedAt?: Date;
  status: "success" | "failed" | "skipped";
  data?: any;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  workflowId: string;
  contentIds: string[];
  audience: {
    leads: string[];
    segments: string[];
  };
  startDate: Date;
  endDate?: Date;
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  performance?: CampaignPerformance;
}

export interface CampaignPerformance {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  unsubscribed: number;
}

// Email channel service
export class EmailService {
  async sendEmail(recipient: Lead, subject: string, content: TextContent): Promise<boolean> {
    try {
      // In a real implementation, this would connect to an email service API
      // like SendGrid, Mailchimp, etc.
      console.log(`Email sent to ${recipient.email} with subject: ${subject}`);
      return true;
    } catch (error) {
      console.error("Email sending error:", error);
      return false;
    }
  }

  async scheduleEmail(recipient: Lead, subject: string, content: TextContent, sendAt: Date): Promise<string> {
    try {
      // Schedule an email for future delivery
      const scheduledId = `email-${Date.now()}`;
      console.log(`Email scheduled for ${recipient.email} at ${sendAt.toISOString()}`);
      return scheduledId;
    } catch (error) {
      console.error("Email scheduling error:", error);
      throw new Error("Failed to schedule email");
    }
  }
}

// SMS channel service
export class SMSService {
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // In a real implementation, this would connect to an SMS API
      // like Twilio, Nexmo, etc.
      console.log(`SMS sent to ${phoneNumber}: ${message}`);
      return true;
    } catch (error) {
      console.error("SMS sending error:", error);
      return false;
    }
  }

  async scheduleSMS(phoneNumber: string, message: string, sendAt: Date): Promise<string> {
    try {
      // Schedule an SMS for future delivery
      const scheduledId = `sms-${Date.now()}`;
      console.log(`SMS scheduled for ${phoneNumber} at ${sendAt.toISOString()}`);
      return scheduledId;
    } catch (error) {
      console.error("SMS scheduling error:", error);
      throw new Error("Failed to schedule SMS");
    }
  }
}

// Social media channel service
export class SocialMediaService {
  async postToSocial(
    platform: "linkedin" | "twitter" | "facebook" | "instagram",
    content: TextContent | ImageContent | VideoContent
  ): Promise<boolean> {
    try {
      // In a real implementation, this would connect to social media platform APIs
      console.log(`Posted to ${platform}: ${JSON.stringify(content)}`);
      return true;
    } catch (error) {
      console.error(`${platform} posting error:`, error);
      return false;
    }
  }

  async scheduleSocialPost(
    platform: "linkedin" | "twitter" | "facebook" | "instagram",
    content: TextContent | ImageContent | VideoContent,
    postAt: Date
  ): Promise<string> {
    try {
      // Schedule a social media post for future posting
      const scheduledId = `social-${platform}-${Date.now()}`;
      console.log(`${platform} post scheduled for ${postAt.toISOString()}`);
      return scheduledId;
    } catch (error) {
      console.error(`${platform} post scheduling error:`, error);
      throw new Error(`Failed to schedule ${platform} post`);
    }
  }
}

// Main workflow execution service
export class WorkflowService {
  private emailService: EmailService;
  private smsService: SMSService;
  private socialMediaService: SocialMediaService;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SMSService();
    this.socialMediaService = new SocialMediaService();
  }

  async executeWorkflow(workflow: Workflow, leads: Lead[]): Promise<WorkflowExecution> {
    try {
      // Initialize workflow execution
      const execution: WorkflowExecution = {
        id: `exec-${Date.now()}`,
        workflowId: workflow.id,
        startedAt: new Date(),
        status: "running",
        targetLeads: leads.map(lead => lead.id),
        results: []
      };

      // In a real implementation, this would be a proper workflow engine
      // that handles async steps, branching, waiting periods, etc.
      // For now, we'll just simulate the execution

      console.log(`Starting workflow execution: ${workflow.name}`);
      
      // Execute each step sequentially for demonstration purposes
      for (const step of workflow.steps) {
        const result = await this.executeWorkflowStep(step, leads, execution);
        execution.results.push(result);
        
        // Handle workflow execution based on step result
        if (result.status === "failed") {
          execution.status = "failed";
          break;
        }
      }
      
      if (execution.status === "running") {
        execution.status = "completed";
      }
      
      return execution;
    } catch (error) {
      console.error("Workflow execution error:", error);
      throw new Error("Failed to execute workflow");
    }
  }

  private async executeWorkflowStep(
    step: WorkflowStep, 
    leads: Lead[], 
    execution: WorkflowExecution
  ): Promise<WorkflowStepResult> {
    const result: WorkflowStepResult = {
      stepId: step.id,
      startedAt: new Date(),
      status: "success"
    };

    try {
      execution.currentStep = step.id;
      
      switch (step.type) {
        case "email":
          // Send emails to all leads
          for (const lead of leads) {
            await this.emailService.sendEmail(
              lead, 
              step.details.subject, 
              { content: step.details.content }
            );
          }
          break;
          
        case "sms":
          // Send SMS to all leads
          for (const lead of leads) {
            if (lead.phone) {
              await this.smsService.sendSMS(lead.phone, step.details.message);
            }
          }
          break;
          
        case "social":
          // Post to social media
          await this.socialMediaService.postToSocial(
            step.details.platform,
            { content: step.details.content }
          );
          break;
          
        case "wait":
          // In a real implementation, this would pause the workflow execution
          // For now, we'll just simulate the wait
          console.log(`Waiting for ${step.details.duration}`);
          break;
          
        case "condition":
          // Evaluate condition and determine next steps
          // This is a simplified implementation
          console.log(`Evaluating condition: ${step.details.condition}`);
          break;
          
        default:
          throw new Error(`Unsupported step type: ${step.type}`);
      }
      
      result.completedAt = new Date();
      return result;
    } catch (error) {
      console.error(`Step execution error (${step.name}):`, error);
      result.status = "failed";
      result.completedAt = new Date();
      return result;
    }
  }
  
  // Create a new workflow
  async createWorkflow(workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">): Promise<Workflow> {
    try {
      const newWorkflow: Workflow = {
        ...workflow,
        id: `workflow-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In a real implementation, this would save to a database
      console.log(`Created new workflow: ${newWorkflow.name}`);
      
      return newWorkflow;
    } catch (error) {
      console.error("Workflow creation error:", error);
      throw new Error("Failed to create workflow");
    }
  }
  
  // Update an existing workflow
  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      // In a real implementation, this would update a workflow in the database
      console.log(`Updated workflow ${id}`);
      
      // Mock return
      return {
        ...updates,
        id,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
      } as Workflow;
    } catch (error) {
      console.error("Workflow update error:", error);
      throw new Error("Failed to update workflow");
    }
  }
  
  // Delete a workflow
  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from a database
      console.log(`Deleted workflow ${id}`);
      return true;
    } catch (error) {
      console.error("Workflow deletion error:", error);
      return false;
    }
  }
}