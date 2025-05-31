# 🔑 Canva & Adobe Integration - API Keys Required

## Core Integration API Keys

### Required for Canva Integration
```bash
# Canva OAuth Configuration
NEXT_PUBLIC_CANVA_CLIENT_ID=your_canva_client_id
CANVA_CLIENT_SECRET=your_canva_client_secret
```

**Setup Instructions:**
1. Go to [Canva Developers](https://www.canva.com/developers/)
2. Create a new application
3. Add redirect URI: `https://yourdomain.com/api/create/canva/callback`
4. Request scopes: `design:read`, `design:write`, `asset:read`, `asset:write`, `brand:read`
5. Copy Client ID and Client Secret

### Required for Adobe Express Integration
```bash
# Adobe Creative SDK Configuration
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_adobe_client_id
ADOBE_CLIENT_SECRET=your_adobe_client_secret
```

**Setup Instructions:**
1. Go to [Adobe Developer Console](https://developer.adobe.com/)
2. Create a new project
3. Add Creative SDK API
4. Configure OAuth redirect URI: `https://yourdomain.com/api/create/adobe/callback`
5. Request scopes: `creative_sdk`, `openid`, `read_organizations`
6. Copy Client ID and Client Secret

## Environment Variables Summary

Add these to your `.env.local` file:

```bash
# Base URL for OAuth redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Canva Integration
NEXT_PUBLIC_CANVA_CLIENT_ID=your_canva_client_id
CANVA_CLIENT_SECRET=your_canva_client_secret

# Adobe Express Integration  
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_adobe_client_id
ADOBE_CLIENT_SECRET=your_adobe_client_secret
```

## Features Enabled

### Canva Integration Features
- [x] OAuth 2.0 authentication flow
- [x] Design listing and management
- [x] New design creation
- [x] Style extraction from designs
- [x] AI-powered design assistance
- [x] Real-time chat interface
- [x] Brand kit management

### Adobe Express Integration Features
- [x] OAuth 2.0 authentication flow
- [x] Project listing and management
- [x] Asset library access
- [x] New project creation
- [x] AI enhancement tools
- [x] Creative Cloud integration
- [x] Multi-format support

### Enhanced Workflow Builder
- [x] AI chat interface integration
- [x] Natural language workflow creation
- [x] Template-based workflow generation
- [x] Node-based visual editor
- [x] Real-time preview
- [x] Campaign integration

## Integration Status

### Implemented Components
- [x] `/create` - Main creative studio page
- [x] `/create/setup` - Integration setup wizard
- [x] `/create/canva` - Canva dashboard
- [x] `/create/adobe` - Adobe Express dashboard
- [x] `/create/templates` - Template browser (placeholder)
- [x] `/create/new` - New project creator (placeholder)

### API Routes
- [x] `/api/create/canva/callback` - Canva OAuth handler
- [x] `/api/create/adobe/callback` - Adobe OAuth handler

### Services
- [x] `canvaIntegrationService` - Complete Canva API wrapper
- [x] `adobeExpressService` - Complete Adobe Express API wrapper
- [x] Enhanced `AIWorkflowBuilder` - AI-powered workflow creation

## Deployment Notes

1. **OAuth Redirect URIs**: Update redirect URIs in both Canva and Adobe apps to match your production domain
2. **Environment Variables**: Ensure all API keys are set in your deployment environment
3. **HTTPS Required**: OAuth flows require HTTPS in production
4. **Rate Limiting**: Both APIs have rate limits - implement appropriate caching
5. **Error Handling**: Monitor OAuth callback errors and provide user-friendly messages

## Testing

### Local Development
1. Set up ngrok or similar tunnel for HTTPS callback testing
2. Configure OAuth apps with tunnel URLs
3. Test full authentication flows
4. Verify API integration functionality

### Production Deployment
1. Update OAuth redirect URIs to production URLs
2. Test authentication flows in production environment
3. Monitor API usage and rate limits
4. Implement proper error logging and monitoring

## Security Considerations

- OAuth tokens are stored in memory only (no persistence implemented)
- State parameters verified for CSRF protection
- Client secrets stored securely in environment variables
- API keys never exposed to client-side code
- Implement token refresh logic for production use

## Next Steps

1. **Provide API Keys**: Set up Canva and Adobe developer accounts and provide API credentials
2. **Test Integration**: Verify OAuth flows and API functionality
3. **Enhanced Features**: Add real-time collaboration, advanced AI features
4. **Production Deployment**: Configure for production environment with proper monitoring