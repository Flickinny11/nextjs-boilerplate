# 🔑 COMPLETE API CONFIGURATION GUIDE - CaptureIT LS

## 🚀 Quick Start Deployment Guide

This file contains **ALL** the API keys and configurations needed to make CaptureIT LS fully operational. Simply provide the API keys below, and the entire application will be ready for production deployment.

## 📋 Required Environment Variables

Create or update your `.env.local` file with these variables:

```bash
# ==================================================
# BASE CONFIGURATION
# ==================================================
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret-key-32-chars-min

# ==================================================
# WORKING - FIREBASE (Already Configured)
# ==================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBEFbAIue4tX_UYJXAPRZvIz1Yspp5sR_s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=captureit-ls.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=captureit-ls
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=captureit-ls.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=407561819595
NEXT_PUBLIC_FIREBASE_APP_ID=1:407561819595:web:ef6d582d2aa29d0a26524e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-30SPB3LJ35

# ==================================================
# WORKING - AI SERVICES (Already Configured)
# ==================================================
OPENROUTER_API_KEY=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
SEGMIND_API_KEY=SG_980ef93a48067d2a

# ==================================================
# WORKING - GOOGLE MAPS (Already Configured)
# ==================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAmnBTXnFQIQ6JRg9UBomH4de0zfR2J9o0

# ==================================================
# WORKING - STRIPE PAYMENTS (Already Configured)
# ==================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RPEbZ2KRfBV8ELzwlVnrkzOoE7JxBNaBgAqEuWOxJTN1zullzP0CdzGflZsofkisQWuBgxiBmvUx9jifHZYvVCB00VhrDaRYu
STRIPE_SECRET_KEY=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

# ==================================================
# NEEDED - CANVA INTEGRATION (HIGH PRIORITY)
# ==================================================
NEXT_PUBLIC_CANVA_CLIENT_ID=your_canva_client_id
CANVA_CLIENT_SECRET=your_canva_client_secret

# ==================================================
# NEEDED - ADOBE EXPRESS INTEGRATION (HIGH PRIORITY) 
# ==================================================
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_adobe_client_id
ADOBE_CLIENT_SECRET=your_adobe_client_secret

# ==================================================
# NEEDED - EMAIL INTEGRATIONS (MEDIUM PRIORITY)
# ==================================================
# Gmail OAuth
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Microsoft OAuth (Outlook + Teams)
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Yahoo Mail OAuth (Optional)
NEXT_PUBLIC_YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret

# Zoho Mail OAuth (Optional)
NEXT_PUBLIC_ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret

# ==================================================
# NEEDED - VIDEO CONFERENCING (MEDIUM PRIORITY)
# ==================================================
# Zoom Integration
NEXT_PUBLIC_ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# Microsoft Teams (uses same Microsoft OAuth as above)

# ==================================================
# NEEDED - CAPTUREIT CALLS (ADVANCED FEATURES)
# ==================================================
# Agora.io Video Conferencing
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

# Firebase Realtime Database (for advanced messaging)
FIREBASE_DATABASE_URL=https://captureit-ls-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"captureit-ls","private_key_id":"..."}

# ==================================================
# OPTIONAL - ADDITIONAL SERVICES
# ==================================================
# SendGrid (Email sending service)
SENDGRID_API_KEY=your_sendgrid_api_key

# Twilio (SMS/WhatsApp integration)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# OpenAI (Additional AI features)
OPENAI_API_KEY=your_openai_api_key
```

## 🎯 API Setup Instructions

### 1. CANVA INTEGRATION (Required for Creative Features)

1. Go to [Canva Developers](https://www.canva.com/developers/)
2. Create a new application
3. Set Application Type: "Web Application"
4. Add redirect URIs:
   - `https://yourdomain.com/api/create/canva/callback`
   - `http://localhost:3000/api/create/canva/callback` (for development)
5. Request scopes:
   - `design:read` - Read design data
   - `design:write` - Create and modify designs
   - `asset:read` - Access brand assets
   - `asset:write` - Upload brand assets
   - `brand:read` - Access brand information
6. Copy Client ID and Client Secret to your environment variables

### 2. ADOBE EXPRESS INTEGRATION (Required for Creative Features)

1. Go to [Adobe Developer Console](https://developer.adobe.com/)
2. Create a new project
3. Add "Creative SDK" API
4. Configure OAuth:
   - Redirect URI: `https://yourdomain.com/api/create/adobe/callback`
   - Default redirect URI: `http://localhost:3000/api/create/adobe/callback`
5. Request scopes:
   - `creative_sdk` - Access Creative Cloud
   - `openid` - User identification
   - `read_organizations` - Organization access
6. Copy Client ID and Client Secret to your environment variables

### 3. GMAIL INTEGRATION (Email Features)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://yourdomain.com/api/email/gmail/callback`
   - `http://localhost:3000/api/email/gmail/callback`
6. Copy Client ID and Client Secret

### 4. MICROSOFT INTEGRATION (Outlook + Teams)

1. Go to [Azure App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. Create a new registration
3. Set redirect URIs:
   - `https://yourdomain.com/api/email/microsoft/callback`
   - `https://yourdomain.com/api/video/teams/callback`
4. Add API permissions:
   - Microsoft Graph: `Mail.ReadWrite`, `Calendars.ReadWrite`, `User.Read`
   - Teams: `OnlineMeetings.ReadWrite`
5. Copy Application (client) ID and create a client secret

### 5. ZOOM INTEGRATION (Video Meetings)

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Create a new OAuth app
3. Set redirect URL: `https://yourdomain.com/api/video/zoom/callback`
4. Add scopes:
   - `meeting:write` - Create meetings
   - `meeting:read` - Read meeting info
   - `user:read` - Read user profile
5. Copy Client ID and Client Secret

### 6. AGORA.IO INTEGRATION (Advanced Video Conferencing)

1. Go to [Agora Console](https://console.agora.io/)
2. Create a new project
3. Choose "App ID + Token" authentication
4. Copy App ID and App Certificate
5. Configure channel settings for video calling

## 💰 PRICING STRUCTURE WITH 300% MARKUP

### API Cost Calculations (Monthly)

#### OpenRouter AI Costs (Current Usage)
- GPT-4: ~$0.30 per 1K tokens
- Our markup: $0.90 per 1K tokens (300% increase)
- Estimated monthly cost per user: $2-15 depending on usage

#### Canva API Costs
- Design operations: ~$0.10 per design
- Our markup: $0.30 per design
- Estimated monthly cost: $5-25 per active user

#### Adobe Express Costs
- API calls: ~$0.05 per operation
- Our markup: $0.15 per operation
- Estimated monthly cost: $3-20 per active user

#### Video Conferencing (Agora.io)
- Video minutes: ~$0.99 per 1000 minutes
- Our markup: $2.97 per 1000 minutes
- Estimated cost: $1-10 per user depending on usage

### Updated Pricing Tiers

#### Individual Plans
- **Entry ($5/month)**: Profit margin $2-3 after API costs
- **Professional ($40/month)**: Profit margin $25-35 after API costs
- **Business ($60/month)**: Profit margin $35-50 after API costs  
- **Premium ($80/month)**: Profit margin $50-70 after API costs

#### Organization Plans (Per User Basis)
- **Team ($25/month per 5 users = $5/user)**: Same as individual entry
- **Business ($200/month per 25 users = $8/user)**: Higher efficiency
- **Enterprise ($800/month unlimited)**: Maximum profit margins

## 🚀 DEPLOYMENT PRIORITY

### Phase 1: Core Deployment (Ready Now)
✅ Deploy with existing features:
- User authentication
- CRM and lead management
- Marketing tools
- Payment processing
- Territory mapping

### Phase 2: Creative Integration (After Canva + Adobe APIs)
🔧 Add creative features:
- Design creation and management
- Brand asset management
- Template systems

### Phase 3: Communication Features (After Email + Video APIs)
🔧 Add communication tools:
- Email integration
- Meeting scheduling
- Basic video conferencing

### Phase 4: Advanced Features (After Agora.io setup)
🔧 Add advanced capabilities:
- CaptureIT Calls with HD video
- Advanced messaging platform
- Real-time collaboration

## 📱 MOBILE APP READINESS

### Current Status
✅ PWA (Progressive Web App) fully configured
✅ Mobile-responsive design
✅ Touch-optimized interfaces
✅ Offline capability planned

### Missing for App Store Deployment
🔧 Native mobile app builds (React Native or Capacitor)
🔧 App store developer accounts
🔧 App store assets and metadata

## 🔧 DEPLOYMENT SCRIPT

Create this deployment script to automate setup:

```bash
#!/bin/bash
# CaptureIT LS Deployment Script

echo "🚀 Starting CaptureIT LS deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Set up environment variables
echo "⚙️ Configure environment variables in your deployment platform:"
echo "- Add all variables from COMPLETE_API_CONFIGURATION.md"
echo "- Ensure NEXT_PUBLIC_BASE_URL matches your domain"

# Database setup
echo "🗄️ Setting up database..."
echo "- Firebase Firestore is automatically configured"
echo "- No additional database setup required"

echo "✅ Deployment ready! Configure API keys and deploy to your platform."
```

## 📞 SUPPORT CONTACTS

### API Provider Support
- **Canva**: [Canva Developer Support](https://www.canva.com/developers/support/)
- **Adobe**: [Adobe Developer Support](https://developer.adobe.com/support/)
- **Google**: [Google Cloud Support](https://cloud.google.com/support)
- **Microsoft**: [Azure Support](https://azure.microsoft.com/support/)
- **Zoom**: [Zoom Developer Support](https://developers.zoom.us/support/)
- **Agora**: [Agora Support](https://www.agora.io/support/)

### Deployment Platforms
- **Vercel**: Recommended for Next.js (free tier available)
- **Netlify**: Alternative with good free tier
- **AWS Amplify**: Enterprise-grade with auto-scaling
- **Railway**: Simple deployment with database included

## 🔒 SECURITY CHECKLIST

### Before Production Deployment
- [ ] All API keys stored securely in environment variables
- [ ] No API keys committed to git repository
- [ ] HTTPS enabled for all OAuth callbacks
- [ ] Rate limiting configured for API endpoints
- [ ] User data encryption enabled
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] SQL injection protection (using Firebase = protected)
- [ ] XSS protection enabled

### Post-Deployment Monitoring
- [ ] API usage monitoring setup
- [ ] Error logging configured
- [ ] Performance monitoring active
- [ ] Backup strategy implemented
- [ ] Incident response plan ready

---

## 🎉 FINAL DEPLOYMENT STATUS

**Immediate Deployment**: Core features ready with existing API keys
**Full Feature Deployment**: Requires Canva + Adobe API keys (highest priority)
**Advanced Features**: Requires all API integrations

**Estimated Setup Time**: 2-4 hours for all API integrations
**Estimated Deployment Time**: 30 minutes after API keys are configured

**Revenue Projection**: $5-80/month per user with 300% markup on all API costs ensuring profitable operations from day one.