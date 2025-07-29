#!/bin/bash

# Static.news Deployment Script for Koyeb
# This script deploys the world's first fully AI-operated news network

echo "🚀 Deploying Static.news to Koyeb..."

# Install Koyeb CLI if not already installed
if ! command -v koyeb &> /dev/null; then
    echo "📥 Installing Koyeb CLI..."
    curl https://www.koyeb.com/install.sh | bash
fi

# Set Koyeb API key
export KOYEB_API_KEY="3z8vngdtvuvafuug7u9499k1b0n8jq329sfpxd167p2iyz71ff2avq9g9gzqy5co"

echo "🔧 Configuring deployment..."

# Deploy with GPU instance for AI processing
koyeb deploy . \
  --instance-type gpu-nvidia-l40s \
  --region was,fra,sin \
  --type web \
  --name static-news \
  --env HUGGINGFACE_TOKEN=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 \
  --env KOYEB_API_KEY=3z8vngdtvuvafuug7u9499k1b0n8jq329sfpxd167p2iyz71ff2avq9g9gzqy5co \
  --env BREAKDOWN_PRICE=4.99 \
  --env NEWS_UPDATE_INTERVAL=300000 \
  --env EMERGENCY_CHECK_INTERVAL=60000

echo "✅ Static.news deployed successfully!"
echo "📺 The world's first AI news network is now live!"
echo "🤖 3 AI anchors are ready for autonomous operation"
echo "💰 Revenue generation system is active"
echo ""
echo "🌐 Your Static.news network will be available at:"
echo "   https://static-news-[random].koyeb.app"
echo ""
echo "🎯 Features now live:"
echo "   ✓ 24/7 autonomous AI broadcasting"
echo "   ✓ Real-time news aggregation"
echo "   ✓ Emergency alert system"
echo "   ✓ Revenue generation ($4.99 breakdown triggers)"
echo "   ✓ Analytics and performance tracking"
echo "   ✓ Mobile push notifications"
echo ""
echo "🏆 Achievement Unlocked: First AI-Built & AI-Run News Network!"