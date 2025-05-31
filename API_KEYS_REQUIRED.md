# 🔑 REQUIRED API KEYS AND CONFIGURATIONS

## ✅ **EXISTING CONFIGURATIONS (ALREADY WORKING)**
```bash
# These are already configured and working
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other existing Firebase vars
```

## 🆕 **NEW FEATURE CONFIGURATIONS NEEDED**

### **📧 Email Integration**
```bash
# Gmail Integration (REQUIRED for Gmail)
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Microsoft Integration (REQUIRED for Outlook)
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Optional: Additional Email Providers
NEXT_PUBLIC_YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
NEXT_PUBLIC_ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
```

### **📹 Video Conferencing Integration**
```bash
# Microsoft Teams (REQUIRED for Teams meetings)
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id  # Same as above
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret      # Same as above

# Zoom Integration (REQUIRED for Zoom meetings)
NEXT_PUBLIC_ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
```

## 🎯 **MINIMUM SETUP FOR FULL FUNCTIONALITY**

To get **ALL** new features working, you need **ONLY**:

1. **Microsoft OAuth App** (enables Outlook email + Teams meetings)
2. **Zoom OAuth App** (enables Zoom meetings)
3. **Gmail OAuth App** (enables Gmail email)

### **Quick Setup Priority:**

**HIGHEST PRIORITY** (Enables most features):
```bash
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```
This enables: Outlook email integration + Teams video conferencing

**SECOND PRIORITY** (Enables popular email provider):
```bash
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_gmail_client_id  
GMAIL_CLIENT_SECRET=your_gmail_client_secret
```
This enables: Gmail email integration

**THIRD PRIORITY** (Enables popular video platform):
```bash
NEXT_PUBLIC_ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret  
```
This enables: Zoom video conferencing

## 🚀 **FEATURES THAT WORK WITHOUT ADDITIONAL SETUP**

These features are **ready to use immediately** with existing configurations:

- ✅ **AI Message Summarization** (uses existing OpenRouter API)
- ✅ **Enhanced CRM Import** (uses existing CRM infrastructure) 
- ✅ **AI Workflow Builder** (uses existing OpenRouter API)
- ✅ **Manual Email Configuration** (IMAP/SMTP for any provider)

## 📝 **OAUTH SETUP INSTRUCTIONS**

### **1. Microsoft (Teams + Outlook)**
1. Go to [Azure Portal](https://portal.azure.com/) → Azure Active Directory → App registrations
2. Click "New registration"
3. Name: "CaptureIT LS Integration"
4. Redirect URI: `https://yourdomain.com/api/video/oauth/callback`
5. Register app, copy **Application (client) ID**
6. Go to "Certificates & secrets" → New client secret → Copy **Value**
7. Go to "API permissions" → Add permissions:
   - Microsoft Graph: `Mail.Read`, `Mail.Send`, `Mail.ReadWrite`
   - Microsoft Graph: `OnlineMeetings.ReadWrite`, `Calendars.ReadWrite`, `User.Read`
8. Grant admin consent

### **2. Google (Gmail)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project → Enable Gmail API
3. Go to "Credentials" → Create OAuth 2.0 Client ID
4. Application type: Web application
5. Authorized redirect URIs: `https://yourdomain.com/api/email/oauth/callback`
6. Copy **Client ID** and **Client secret**

### **3. Zoom**
1. Go to [Zoom Marketplace](https://marketplace.zoom.us/) → Develop → Build App
2. Choose "OAuth" app type
3. App name: "CaptureIT LS Integration"
4. Redirect URL: `https://yourdomain.com/api/video/oauth/callback`
5. Add scopes: `meeting:write`, `meeting:read`, `user:read`
6. Copy **Client ID** and **Client Secret**

## 🎊 **DEPLOYMENT READY**

With just the Microsoft OAuth app configured, you get:
- ✅ Email integration (Outlook)
- ✅ Video conferencing (Teams)  
- ✅ AI message summarization
- ✅ Enhanced CRM import
- ✅ AI workflow builder

**Total time to full functionality: ~15 minutes of OAuth setup!**