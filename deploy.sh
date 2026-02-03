#!/bin/bash
# Deployment script for Summer's Phone System

set -e

echo "🚀 Deploying Summer's Phone System..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_deps() {
  echo "📋 Checking dependencies..."
  
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
  fi
  
  if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
  fi
  
  if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not installed (optional for local dev)"
  fi
  
  echo "✅ Dependencies OK"
}

# Set up environment
copy_env() {
  echo "🔧 Setting up environment..."
  
  if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local - YOU MUST EDIT THIS FILE!"
    echo "   Add your Supabase and Twilio credentials"
  else
    echo "✅ .env.local already exists"
  fi
}

# Install dependencies
install_deps() {
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
}

# Deploy database
deploy_db() {
  echo "🗄️  Deploying database schema..."
  
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY not set in .env.local"
    echo "   Cannot deploy database schema"
    return 1
  fi
  
  # Push schema to Supabase
  npx supabase db push --db-url "$NEXT_PUBLIC_SUPABASE_URL"
  echo "✅ Database schema deployed"
}

# Build the app
build_app() {
  echo "🔨 Building application..."
  npm run build
  echo "✅ Build complete"
}

# Deploy to Vercel
deploy_vercel() {
  echo "☁️  Deploying to Vercel..."
  
  if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "   Install with: npm i -g vercel"
    exit 1
  fi
  
  vercel --prod
  echo "✅ Deployed to Vercel"
}

# Configure Twilio webhook
configure_twilio() {
  echo "☎️  Configuring Twilio webhook..."
  
  if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ]; then
    echo "❌ Twilio credentials not found in .env.local"
    return 1
  fi
  
  echo "Manual step required:"
  echo "1. Go to https://console.twilio.com/"
  echo "2. Navigate to Phone Numbers → Manage → Active Numbers"
  echo "3. Click on your phone number (+18449023577)"
  echo "4. In the Messaging section, set Webhook URL to:"
  echo "   ${RED}https://your-deployment.vercel.app/api/webhooks/twilio/sms${NC}"
  echo "5. Set HTTP method to: ${RED}POST${NC}"
  echo "6. Save the configuration"
}

# Test the system
test_system() {
  echo "🧪 Testing system..."
  
  echo "Testing API endpoints..."
  curl -s -f http://localhost:3000/api/contacts > /dev/null && echo "✅ Contacts API OK" || echo "⚠️  Contacts API not responding"
  curl -s -f http://localhost:3000/api/conversations > /dev/null && echo "✅ Conversations API OK" || echo "⚠️  Conversations API not responding"
  
  echo "Tip: Open http://localhost:3000 to test the webapp"
}

# Start development server
start_dev() {
  echo "🚀 Starting development server..."
  echo "Visit http://localhost:3000 to view the dashboard"
  npm run dev
}

# Main menu
show_menu() {
  echo ""
  echo "${GREEN}┌─────────────────────────────────────┐${NC}"
  echo "${GREEN}│  Summer's Phone Deployment Menu    │${NC}"
  echo "${GREEN}└─────────────────────────────────────┘${NC}"
  echo ""
  echo "1) Check dependencies"
  echo "2) Copy environment file"
  echo "3) Install dependencies"
  echo "4) Deploy database schema"
  echo "5) Build application"
  echo "6) Deploy to Vercel"
  echo "7) Configure Twilio webhook"
  echo "8) Test system"
  echo "9) Start development server"
  echo "10) Full deployment (steps 1-6)"
  echo ""
  echo "0) Exit"
  echo ""
}

# Parse command line argument
case "${1:-menu}" in
  "deps")
    check_deps
    ;;
  "env")
    copy_env
    ;;
  "install")
    install_deps
    ;;
  "db")
    deploy_db
    ;;
  "build")
    build_app
    ;;
  "vercel")
    deploy_vercel
    ;;
  "twilio")
    configure_twilio
    ;;
  "test")
    test_system
    ;;
  "dev")
    start_dev
    ;;
  "full")
    check_deps
    copy_env
    install_deps
    deploy_db
    build_app
    deploy_vercel
    ;;
  "menu"|*)
    check_deps
    show_menu
    read -p "Select option (0-10): " choice
    case "$choice" in
      1) check_deps ;;
      2) copy_env ;;
      3) install_deps ;;
      4) deploy_db ;;
      5) build_app ;;
      6) deploy_vercel ;;
      7) configure_twilio ;;
      8) test_system ;;
      9) start_dev ;;
      10) check_deps; copy_env; install_deps; deploy_db; build_app; deploy_vercel ;;
      0) exit 0 ;;
      *) echo "Invalid option" ;;
    esac
    ;;
esac