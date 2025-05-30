// Email service for sending organization invitations
// This would integrate with services like SendGrid, Mailgun, or similar

import { OrganizationInvitation, Organization } from './organizationTypes';

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Generate invitation email template
  generateInvitationEmail(
    invitation: OrganizationInvitation, 
    organization: Organization,
    inviterName: string
  ): EmailTemplate {
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/organization/accept-invite?token=${invitation.token}`;
    
    const subject = `You're invited to join ${organization.name} on CaptureIT LS`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Organization Invitation</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f8f9fa; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CaptureIT LS</h1>
            <h2>Organization Invitation</h2>
          </div>
          
          <div class="content">
            <h3>You're invited to join ${organization.name}!</h3>
            
            <p>Hi there,</p>
            
            <p><strong>${inviterName}</strong> has invited you to join <strong>${organization.name}</strong> on CaptureIT LS as a <strong>${invitation.role}</strong>.</p>
            
            <p>CaptureIT LS is an AI-powered content creation platform that helps teams create engaging marketing materials, manage leads, and streamline their sales process.</p>
            
            <p>As a member of ${organization.name}, you'll have access to:</p>
            <ul>
              <li>Shared credit pool for AI-powered content creation</li>
              <li>Team collaboration tools</li>
              <li>Organization-wide analytics and reporting</li>
              <li>Centralized billing and management</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${inviteUrl}" class="button">Accept Invitation</a>
            </div>
            
            <p><small>This invitation will expire on ${new Date(invitation.expiresAt).toLocaleDateString()}.</small></p>
            
            <p>If you have any questions, feel free to reach out to ${inviterName} or our support team.</p>
            
            <p>Best regards,<br>The CaptureIT LS Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 CaptureIT LS. All rights reserved.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const textContent = `
You're invited to join ${organization.name} on CaptureIT LS!

Hi there,

${inviterName} has invited you to join ${organization.name} on CaptureIT LS as a ${invitation.role}.

CaptureIT LS is an AI-powered content creation platform that helps teams create engaging marketing materials, manage leads, and streamline their sales process.

As a member of ${organization.name}, you'll have access to:
- Shared credit pool for AI-powered content creation
- Team collaboration tools
- Organization-wide analytics and reporting
- Centralized billing and management

To accept this invitation, please visit:
${inviteUrl}

This invitation will expire on ${new Date(invitation.expiresAt).toLocaleDateString()}.

If you have any questions, feel free to reach out to ${inviterName} or our support team.

Best regards,
The CaptureIT LS Team

---
© 2024 CaptureIT LS. All rights reserved.
If you didn't expect this invitation, you can safely ignore this email.
    `;

    return { subject, htmlContent, textContent };
  }

  // Send invitation email (would integrate with actual email service)
  async sendInvitationEmail(
    invitation: OrganizationInvitation,
    organization: Organization,
    inviterName: string
  ): Promise<boolean> {
    try {
      const emailTemplate = this.generateInvitationEmail(invitation, organization, inviterName);
      
      // In production, this would use an actual email service like:
      // - SendGrid
      // - Mailgun  
      // - AWS SES
      // - Postmark
      // etc.
      
      console.log('📧 Sending invitation email...');
      console.log('To:', invitation.email);
      console.log('Subject:', emailTemplate.subject);
      console.log('Organization:', organization.name);
      console.log('Role:', invitation.role);
      console.log('Expires:', invitation.expiresAt);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Invitation email sent successfully!');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send invitation email:', error);
      return false;
    }
  }

  // Send organization welcome email to new members
  async sendWelcomeEmail(
    memberEmail: string,
    memberName: string,
    organization: Organization,
    role: string
  ): Promise<boolean> {
    try {
      const subject = `Welcome to ${organization.name} on CaptureIT LS!`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to the Organization</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #28a745; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CaptureIT LS!</h1>
            </div>
            
            <div class="content">
              <h3>Welcome to ${organization.name}, ${memberName}!</h3>
              
              <p>You've successfully joined ${organization.name} as a <strong>${role}</strong>.</p>
              
              <p>You now have access to:</p>
              <ul>
                <li><strong>${organization.billing.creditsAllocated.toLocaleString()}</strong> shared credits per month</li>
                <li>AI-powered content creation tools</li>
                <li>Team collaboration features</li>
                <li>Organization analytics and reporting</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/organization" class="button">Go to Organization Dashboard</a>
              </div>
              
              <p>If you need help getting started, check out our documentation or reach out to your team administrator.</p>
              
              <p>Happy creating!<br>The CaptureIT LS Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 CaptureIT LS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      console.log('📧 Sending welcome email...');
      console.log('To:', memberEmail);
      console.log('Subject:', subject);
      console.log('Organization:', organization.name);
      console.log('Role:', role);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Welcome email sent successfully!');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }

  // Send usage alert emails when credits are running low
  async sendUsageAlertEmail(
    organization: Organization,
    adminEmails: string[],
    usagePercentage: number
  ): Promise<boolean> {
    try {
      const subject = `${organization.name} - Credit Usage Alert (${usagePercentage}% used)`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Usage Alert</title>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Credit Usage Alert</h1>
            </div>
            
            <div class="content">
              <h3>${organization.name} has used ${usagePercentage}% of monthly credits</h3>
              
              <div class="alert">
                <strong>Current Usage:</strong><br>
                Credits Used: ${organization.billing.creditsUsed.toLocaleString()}<br>
                Credits Remaining: ${organization.billing.creditsRemaining.toLocaleString()}<br>
                Total Allocated: ${organization.billing.creditsAllocated.toLocaleString()}
              </div>
              
              <p>Your organization is approaching its monthly credit limit. Consider:</p>
              <ul>
                <li>Upgrading to a higher plan for more credits</li>
                <li>Monitoring team usage patterns</li>
                <li>Setting up usage guidelines for team members</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/organization?tab=billing" class="button">Manage Billing</a>
              </div>
              
              <p>Best regards,<br>The CaptureIT LS Team</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      for (const email of adminEmails) {
        console.log('📧 Sending usage alert email...');
        console.log('To:', email);
        console.log('Subject:', subject);
        console.log('Usage:', `${usagePercentage}%`);
      }
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Usage alert emails sent successfully!');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send usage alert emails:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();