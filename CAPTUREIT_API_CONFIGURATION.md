# CaptureIT Calls & Messages - API Configuration Guide

## Overview
This document provides comprehensive configuration instructions for CaptureIT Calls and CaptureIT Messages, including all required API keys, environment variables, and external service setup.

## Required Services & API Keys

### 1. Real-time Video Infrastructure
CaptureIT Calls requires a robust video infrastructure for enterprise-grade quality.

#### Option A: Agora.io (Recommended)
- **Service**: Real-time video/audio communication
- **Why**: Ultra-low latency, global CDN, enterprise-grade quality
- **Setup**:
  1. Create account at [https://www.agora.io](https://www.agora.io)
  2. Create new project in Agora Console
  3. Get App ID and App Certificate
  4. Enable required features: Video Call, Audio Call, Real-time Messaging

```env
# Agora Configuration
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_certificate_here
AGORA_CUSTOMER_ID=your_customer_id
AGORA_CUSTOMER_SECRET=your_customer_secret
```

#### Option B: Twilio Video (Alternative)
- **Service**: Programmable video platform
- **Setup**:
  1. Create account at [https://www.twilio.com](https://www.twilio.com)
  2. Get Account SID and Auth Token
  3. Enable Video API

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY_SID=your_api_key_sid
TWILIO_API_KEY_SECRET=your_api_key_secret
```

### 2. AI & Machine Learning Services

#### OpenAI (Required for AI Features)
- **Service**: GPT models for smart composition, sentiment analysis, meeting summaries
- **Setup**:
  1. Create account at [https://platform.openai.com](https://platform.openai.com)
  2. Generate API key with GPT-4 access
  3. Set usage limits and billing

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_ORGANIZATION=org-your_organization_id
OPENAI_MODEL=gpt-4-turbo-preview
```

#### Google Cloud AI (Required for Transcription & Translation)
- **Service**: Speech-to-Text, Translation API, Natural Language AI
- **Setup**:
  1. Create Google Cloud Project
  2. Enable APIs: Speech-to-Text, Translation, Natural Language
  3. Create service account and download JSON key
  4. Set up billing account

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
GOOGLE_CLOUD_SPEECH_API_KEY=your_speech_api_key
GOOGLE_CLOUD_TRANSLATE_API_KEY=your_translate_api_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

#### Microsoft Azure Cognitive Services (Alternative)
- **Service**: Speech Services, Translator, Text Analytics
- **Setup**:
  1. Create Azure account
  2. Create Cognitive Services resource
  3. Get subscription key and endpoint

```env
# Azure Configuration
AZURE_COGNITIVE_SERVICES_KEY=your_azure_key
AZURE_COGNITIVE_SERVICES_ENDPOINT=https://your-region.api.cognitive.microsoft.com
AZURE_SPEECH_REGION=your_region
```

### 3. Database & Real-time Sync

#### Firebase (Recommended)
- **Service**: Firestore for real-time messaging, Authentication
- **Setup**:
  1. Create Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
  2. Enable Firestore Database
  3. Enable Authentication
  4. Generate service account key

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_private_key_here
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"...","authDomain":"..."}
```

### 4. File Storage & Media Processing

#### Cloudinary (Recommended)
- **Service**: Image/video upload, processing, CDN
- **Setup**:
  1. Create account at [https://cloudinary.com](https://cloudinary.com)
  2. Get cloud name, API key, and secret

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### AWS S3 (Alternative)
```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### 5. Real-time Communication

#### Socket.io Server
- **Service**: WebSocket connections for real-time messaging
- **Setup**: Deploy socket.io server or use managed service

```env
# Socket.io Configuration
NEXT_PUBLIC_CAPTUREIT_CALLS_SERVER=wss://your-calls-server.com
NEXT_PUBLIC_CAPTUREIT_MESSAGES_SERVER=wss://your-messages-server.com
SOCKET_IO_SECRET=your_socket_secret
```

### 6. Security & Encryption

#### Encryption Keys
```env
# Encryption Configuration
ENCRYPTION_KEY=your_256_bit_encryption_key
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
```

### 7. Email & Notifications

#### SendGrid (Optional)
```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### Pusher (Optional for Push Notifications)
```env
# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_cluster
```

## Complete .env.local Template

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CaptureIT LS

# Video Infrastructure (Choose one)
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate
# OR
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# AI Services
OPENAI_API_KEY=sk-your_openai_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Database
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# Real-time Communication
NEXT_PUBLIC_CAPTUREIT_CALLS_SERVER=ws://localhost:3001
NEXT_PUBLIC_CAPTUREIT_MESSAGES_SERVER=ws://localhost:3002

# Security
ENCRYPTION_KEY=your_encryption_key
JWT_SECRET=your_jwt_secret
```

## Development Setup

### 1. Install Dependencies
```bash
npm install socket.io socket.io-client simple-peer three @react-three/fiber @react-three/drei
npm install agora-rtc-sdk-ng recordrtc
```

### 2. Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Fill in all required API keys
3. Restart development server

### 3. Firebase Setup
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

### 4. Socket.io Server Setup
Create a separate server for real-time communication:

```javascript
// server.js
const io = require('socket.io')(3001, {
  cors: { origin: "http://localhost:3000" }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
  
  socket.on('signal', (data) => {
    socket.to(data.to).emit('signal', data);
  });
});
```

## Production Deployment

### 1. Environment Variables
Set all environment variables in your production environment:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment Variables
- AWS/Google Cloud: Configure in deployment service

### 2. TURN Servers
For production WebRTC, configure TURN servers:
```env
TURN_SERVER_URL=turn:your-turn-server.com:3478
TURN_SERVER_USERNAME=your_username
TURN_SERVER_PASSWORD=your_password
```

### 3. SSL Certificates
Ensure HTTPS for WebRTC functionality:
- Use service like Cloudflare or Let's Encrypt
- Configure SSL termination at load balancer

### 4. Scaling Considerations
- Use Redis for Socket.io adapter in multi-server setup
- Configure CDN for media files
- Set up database connection pooling

## Security Best Practices

### 1. API Key Security
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys regularly
- Implement key restrictions where possible

### 2. WebRTC Security
- Use TURN servers with authentication
- Implement room access controls
- Enable end-to-end encryption
- Monitor for abuse patterns

### 3. Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies
- Regular security audits

## Testing

### 1. Local Testing
```bash
# Start development server
npm run dev

# Test video calls with multiple browser tabs
# Open Network tab to monitor WebRTC connections
```

### 2. Production Testing
- Test with real devices on different networks
- Verify TURN server functionality
- Load test with multiple concurrent users
- Monitor performance metrics

## Troubleshooting

### Common Issues

1. **WebRTC Connection Failed**
   - Check TURN server configuration
   - Verify firewall settings
   - Test with STUN servers

2. **AI Features Not Working**
   - Verify API keys are correct
   - Check API usage limits
   - Monitor API response times

3. **Real-time Updates Delayed**
   - Check Socket.io connection
   - Verify database rules
   - Monitor network latency

### Support Resources
- [Agora Documentation](https://docs.agora.io)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Socket.io Documentation](https://socket.io/docs)

## Cost Estimation

### Monthly Costs (Estimated for 1000 active users)
- **Agora.io**: $200-500 (based on usage)
- **OpenAI API**: $100-300 (based on AI feature usage)
- **Google Cloud**: $50-150 (Speech & Translation)
- **Firebase**: $25-100 (database & storage)
- **Cloudinary**: $50-200 (media processing)
- **Total**: $425-1250/month

### Cost Optimization Tips
- Implement usage monitoring
- Cache AI responses where appropriate
- Optimize media compression
- Use appropriate service tiers
- Monitor and set usage alerts

This configuration will provide a production-ready setup for CaptureIT Calls and Messages with enterprise-grade features and scalability.