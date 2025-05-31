#!/bin/bash

# 🚀 CaptureIT LS - Easy Deployment Script
# This script deploys CaptureIT LS to Vercel (free tier) with minimal configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 CaptureIT LS Deployment Script${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if running in GitHub Codespace
if [ "$CODESPACES" = "true" ]; then
    echo -e "${GREEN}✅ Running in GitHub Codespace${NC}"
    DEPLOYMENT_URL="https://$(echo $CODESPACE_NAME | tr '[:upper:]' '[:lower:]')-3000-$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN"
    echo -e "${YELLOW}Current preview URL: $DEPLOYMENT_URL${NC}"
else
    echo -e "${YELLOW}⚠️  Not running in Codespace. Manual deployment required.${NC}"
fi

echo ""
echo -e "${BLUE}📋 Pre-deployment Checklist${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Environment file found${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
    
    # Create basic .env.local
    cat > .env.local << 'EOF'
# CaptureIT LS Environment Variables
# Copy from COMPLETE_API_CONFIGURATION.md and customize

# Base Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters-long

# Firebase (Already Configured)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBEFbAIue4tX_UYJXAPRZvIz1Yspp5sR_s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=captureit-ls.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=captureit-ls
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=captureit-ls.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=407561819595
NEXT_PUBLIC_FIREBASE_APP_ID=1:407561819595:web:ef6d582d2aa29d0a26524e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-30SPB3LJ35

# AI Services (Already Configured)
OPENROUTER_API_KEY=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
SEGMIND_API_KEY=SG_980ef93a48067d2a

# Google Maps (Already Configured)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAmnBTXnFQIQ6JRg9UBomH4de0zfR2J9o0

# Stripe Payments (Already Configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RPEbZ2KRfBV8ELzwlVnrkzOoE7JxBNaBgAqEuWOxJTN1zullzP0CdzGflZsofkisQWuBgxiBmvUx9jifHZYvVCB00VhrDaRYu
STRIPE_SECRET_KEY=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

# ADD YOUR API KEYS BELOW (See COMPLETE_API_CONFIGURATION.md)
# NEXT_PUBLIC_CANVA_CLIENT_ID=your_canva_client_id
# CANVA_CLIENT_SECRET=your_canva_client_secret
# NEXT_PUBLIC_ADOBE_CLIENT_ID=your_adobe_client_id
# ADOBE_CLIENT_SECRET=your_adobe_client_secret
EOF
    
    echo -e "${GREEN}✅ Created .env.local template${NC}"
fi

echo ""
echo -e "${BLUE}📦 Installing Dependencies${NC}"
npm install

echo ""
echo -e "${BLUE}🔨 Building Application${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Check errors above.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Testing Application${NC}"
npm run lint
echo -e "${GREEN}✅ Lint check completed${NC}"

echo ""
echo -e "${BLUE}🚀 Deployment Options${NC}"
echo ""

# Option 1: Vercel (Recommended)
echo -e "${GREEN}Option 1: Vercel (Recommended - Free)${NC}"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Run: vercel"
echo "3. Follow the prompts"
echo "4. Add environment variables in Vercel dashboard"
echo ""

# Option 2: Netlify
echo -e "${GREEN}Option 2: Netlify (Alternative - Free)${NC}"
echo "1. Install Netlify CLI: npm i -g netlify-cli"
echo "2. Run: netlify deploy --build"
echo "3. Add environment variables in Netlify dashboard"
echo ""

# Option 3: Railway
echo -e "${GREEN}Option 3: Railway (Simple - $5/month)${NC}"
echo "1. Go to railway.app"
echo "2. Connect your GitHub repository"
echo "3. Deploy automatically"
echo ""

# Option 4: Local Development
echo -e "${GREEN}Option 4: Local Development${NC}"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo ""

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo -e "${YELLOW}🚀 Vercel CLI detected. Deploy now? (y/n)${NC}"
    read -r deploy_now
    
    if [ "$deploy_now" = "y" ] || [ "$deploy_now" = "Y" ]; then
        echo -e "${BLUE}Deploying to Vercel...${NC}"
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Deployment successful!${NC}"
            echo -e "${YELLOW}⚠️  Don't forget to add environment variables in Vercel dashboard${NC}"
        else
            echo -e "${RED}❌ Deployment failed${NC}"
        fi
    fi
else
    echo -e "${YELLOW}💡 To deploy to Vercel: npm i -g vercel && vercel${NC}"
fi

echo ""
echo -e "${GREEN}✨ Deployment Summary${NC}"
echo -e "${GREEN}===================${NC}"
echo "• Core features: ✅ Ready (CRM, Leads, Marketing, Payments)"
echo "• Creative features: 🔧 Add Canva + Adobe API keys"
echo "• Communication: 🔧 Add Email + Video API keys"
echo "• Advanced features: 🔧 Add Agora.io for video calls"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "1. Get API keys from COMPLETE_API_CONFIGURATION.md"
echo "2. Add them to your deployment platform's environment variables"
echo "3. Test all features end-to-end"
echo "4. Set up monitoring and analytics"
echo ""
echo -e "${GREEN}🎉 CaptureIT LS is ready for deployment!${NC}"

# If in Codespace, start the dev server
if [ "$CODESPACES" = "true" ]; then
    echo ""
    echo -e "${BLUE}🔥 Starting development server in Codespace...${NC}"
    echo -e "${YELLOW}Preview URL: $DEPLOYMENT_URL${NC}"
    npm run dev &
    
    # Wait for server to start
    sleep 5
    echo -e "${GREEN}✅ Development server started${NC}"
    echo -e "${BLUE}Click the preview URL above to view your application${NC}"
fi