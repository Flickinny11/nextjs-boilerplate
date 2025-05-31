# 🔑 CaptureIT LS - KEYS & CONFIGS FILE

## 📖 Instructions
This file contains **ALL** API keys and configurations needed for CaptureIT LS to be fully operational. 

**How to use this file:**
1. Fill in the API keys and configurations below
2. The system will automatically pull these values and place them in their respective locations
3. All services will become operational once the keys are provided

---

## 🔥 **CORE CONFIGURATION** (Required for Basic Operation)

### Base Application Settings
```
BASE_URL=https://yourdomain.com
NEXTAUTH_SECRET=[Generate a 32+ character secret key]
```

### Firebase Configuration (Authentication, Database, Storage)
```
FIREBASE_API_KEY=AIzaSyBEFbAIue4tX_UYJXAPRZvIz1Yspp5sR_s
FIREBASE_AUTH_DOMAIN=captureit-ls.firebaseapp.com
FIREBASE_PROJECT_ID=captureit-ls
FIREBASE_STORAGE_BUCKET=captureit-ls.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=407561819595
FIREBASE_APP_ID=1:407561819595:web:ef6d582d2aa29d0a26524e
FIREBASE_MEASUREMENT_ID=G-30SPB3LJ35
```

### Google Maps API (Territory Mapping)
```
GOOGLE_MAPS_API_KEY=AIzaSyAmnBTXnFQIQ6JRg9UBomH4de0zfR2J9o0
```

### Payment Processing (Stripe)
```
STRIPE_PUBLISHABLE_KEY=pk_live_51RPEbZ2KRfBV8ELzwlVnrkzOoE7JxBNaBgAqEuWOxJTN1zullzP0CdzGflZsofkisQWuBgxiBmvUx9jifHZYvVCB00VhrDaRYu
STRIPE_SECRET_KEY=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
```

### AI Services (Working)
```
OPENROUTER_API_KEY=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
SEGMIND_API_KEY=SG_980ef93a48067d2a
```

---

## 🎨 **CREATIVE INTEGRATIONS** (High Priority - Enables Design Features)

### Canva Integration
**Status**: ⚠️ NEEDS API KEYS
**Features Enabled**: Design creation, template management, brand assets
**Setup Required**: 
1. Create Canva developer account
2. Register application
3. Add redirect URI: `{BASE_URL}/api/auth/canva/callback`

```
CANVA_CLIENT_ID=[Your Canva Client ID]
CANVA_CLIENT_SECRET=[Your Canva Client Secret]
```

### Adobe Express Integration  
**Status**: ⚠️ NEEDS API KEYS
**Features Enabled**: Advanced photo editing, creative suite access
**Setup Required**:
1. Create Adobe developer account
2. Register Creative SDK application
3. Add redirect URI: `{BASE_URL}/api/auth/adobe/callback`

```
ADOBE_CLIENT_ID=[Your Adobe Client ID]
ADOBE_CLIENT_SECRET=[Your Adobe Client Secret]
```

---

## 📧 **EMAIL INTEGRATIONS** (Medium Priority - Enables Communication Features)

### Gmail Integration
**Status**: ⚠️ NEEDS OAUTH SETUP
**Features Enabled**: Email sending, contact sync, lead communication
**Setup Required**:
1. Google Cloud Console → Create OAuth 2.0 credentials
2. Add redirect URI: `{BASE_URL}/api/auth/gmail/callback`

```
GMAIL_CLIENT_ID=[Your Gmail OAuth Client ID]
GMAIL_CLIENT_SECRET=[Your Gmail OAuth Client Secret]
```

### Microsoft 365 Integration (Outlook + Teams)
**Status**: ⚠️ NEEDS OAUTH SETUP  
**Features Enabled**: Outlook email, Teams meetings, calendar sync
**Setup Required**:
1. Azure AD → Register application
2. Add redirect URI: `{BASE_URL}/api/auth/microsoft/callback`

```
MICROSOFT_CLIENT_ID=[Your Microsoft Client ID]
MICROSOFT_CLIENT_SECRET=[Your Microsoft Client Secret]
```

### Additional Email Providers (Optional)

#### Yahoo Mail
```
YAHOO_CLIENT_ID=[Your Yahoo Client ID]
YAHOO_CLIENT_SECRET=[Your Yahoo Client Secret]
```

#### Zoho Mail
```
ZOHO_CLIENT_ID=[Your Zoho Client ID]
ZOHO_CLIENT_SECRET=[Your Zoho Client Secret]
```

---

## 📹 **VIDEO CONFERENCING** (Medium Priority - Enables Meeting Features)

### Zoom Integration
**Status**: ⚠️ NEEDS OAUTH SETUP
**Features Enabled**: Zoom meeting creation, scheduling, management
**Setup Required**:
1. Zoom Marketplace → Create OAuth app
2. Add redirect URI: `{BASE_URL}/api/auth/zoom/callback`

```
ZOOM_CLIENT_ID=[Your Zoom Client ID]
ZOOM_CLIENT_SECRET=[Your Zoom Client Secret]
```

### Microsoft Teams
**Uses the same Microsoft OAuth credentials as above**

---

## 🚀 **ADVANCED FEATURES** (Low Priority - Premium Features)

### CaptureIT Calls (HD Video Platform)
**Status**: ⚠️ NEEDS AGORA.IO SETUP
**Features Enabled**: HD video calls, real-time messaging, screen sharing
**Setup Required**:
1. Create Agora.io account
2. Create new project
3. Generate App ID and Certificate

```
AGORA_APP_ID=[Your Agora App ID]
AGORA_APP_CERTIFICATE=[Your Agora App Certificate]
```

### Firebase Realtime Database (Advanced Messaging)
**Status**: ⚠️ NEEDS SERVICE ACCOUNT
**Features Enabled**: Real-time messaging, advanced chat features
**Setup Required**:
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key (JSON)

```
FIREBASE_DATABASE_URL=https://captureit-ls-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY=[Full JSON service account key]
```

---

## 📱 **ADDITIONAL SERVICES** (Optional Enhancement)

### Email Delivery Service
```
SENDGRID_API_KEY=[Your SendGrid API Key]
SENDGRID_FROM_EMAIL=[Your verified sender email]
```

### SMS/Phone Services
```
TWILIO_ACCOUNT_SID=[Your Twilio Account SID]
TWILIO_AUTH_TOKEN=[Your Twilio Auth Token]
TWILIO_PHONE_NUMBER=[Your Twilio Phone Number]
```

### Analytics & Monitoring
```
GOOGLE_ANALYTICS_ID=[Your GA4 Measurement ID]
SENTRY_DSN=[Your Sentry DSN for error tracking]
```

---

## 🔒 **SECURITY CONFIGURATIONS**

### OAuth Redirect URIs
Configure these redirect URIs in each service:

- **Canva**: `{BASE_URL}/api/auth/canva/callback`
- **Adobe**: `{BASE_URL}/api/auth/adobe/callback`  
- **Gmail**: `{BASE_URL}/api/auth/gmail/callback`
- **Microsoft**: `{BASE_URL}/api/auth/microsoft/callback`
- **Zoom**: `{BASE_URL}/api/auth/zoom/callback`
- **Yahoo**: `{BASE_URL}/api/auth/yahoo/callback`
- **Zoho**: `{BASE_URL}/api/auth/zoho/callback`

### CORS Settings
Add your domain to allowed origins in each service.

---

## 📊 **OPERATIONAL STATUS SUMMARY**

| Service | Status | Priority | Features |
|---------|--------|----------|----------|
| 🔥 **Firebase Auth** | ✅ **Working** | Core | User authentication, data storage |
| 🔥 **Google Maps** | ✅ **Working** | Core | Territory mapping, location services |
| 🔥 **Stripe** | ✅ **Working** | Core | Payment processing, subscriptions |
| 🔥 **AI Services** | ✅ **Working** | Core | OpenRouter, Segmind AI capabilities |
| 🎨 **Canva** | ⚠️ **Needs Keys** | High | Design creation, templates |
| 🎨 **Adobe Express** | ⚠️ **Needs Keys** | High | Advanced creative tools |
| 📧 **Email Services** | ⚠️ **Needs OAuth** | Medium | Communication, lead outreach |
| 📹 **Video Conferencing** | ⚠️ **Needs OAuth** | Medium | Meetings, client calls |
| 🚀 **CaptureIT Calls** | ⚠️ **Needs Agora** | Low | HD video platform |

---

## 🚀 **DEPLOYMENT PHASES**

### Phase 1: Deploy Now (Core Features Ready)
- ✅ User authentication and management
- ✅ CRM and lead management  
- ✅ Territory mapping
- ✅ Payment processing
- ✅ Basic AI features

### Phase 2: Creative Features (After Canva + Adobe)
- 🔧 Design creation and management
- 🔧 Template systems
- 🔧 Brand asset management

### Phase 3: Communication Features (After Email + Video)
- 🔧 Email integration
- 🔧 Meeting scheduling
- 🔧 Video conferencing

### Phase 4: Advanced Features (After Agora.io)
- 🔧 CaptureIT Calls platform
- 🔧 Advanced messaging
- 🔧 Real-time collaboration

---

## 💡 **SETUP INSTRUCTIONS**

1. **Start with Phase 1**: Deploy with existing working keys
2. **Add Creative APIs**: Set up Canva and Adobe for design features
3. **Add Communication APIs**: Set up email and video services
4. **Add Advanced Features**: Set up Agora.io for premium video calls

**Estimated setup time**: 2-4 hours for all integrations
**Estimated deployment time**: 30 minutes after keys are configured