#!/bin/bash

# Content Writer V3 — System Verification Script
# Run this script to verify that all services work correctly
# Usage: bash VERIFY_SYSTEM.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Content Writer V3 — System Verification Script               ║"
echo "║  This script verifies that all services are working           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check if a service is running
check_service() {
    local name=$1
    local port=$2
    local url=$3

    echo -n "Checking $name on port $port... "

    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((CHECKS_FAILED++))
        echo "  → Service not responding on port $port"
    fi
}

# Function to check if a command exists
check_command() {
    local cmd=$1

    echo -n "Checking for $cmd... "

    if command -v $cmd &> /dev/null; then
        echo -e "${GREEN}✓ Installed${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ Missing${NC}"
        ((CHECKS_FAILED++))
        echo "  → $cmd is not installed"
    fi
}

# Function to check file existence
check_file() {
    local file=$1
    local description=$2

    echo -n "Checking $description... "

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ Found${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ Not Found${NC}"
        ((CHECKS_FAILED++))
        echo "  → File not found: $file"
    fi
}

# Start verification
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 1: Checking Prerequisites"
echo "═══════════════════════════════════════════════════════════════"
echo ""

check_command "dotnet"
check_command "node"
check_command "npm"
check_command "psql"
check_command "curl"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 2: Checking Project Files"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check frontend files
check_file "../content-writer-v3/package.json" "Frontend package.json"
check_file "../content-writer-v3/app/dashboard/page.tsx" "Frontend dashboard page"
check_file "../content-writer-v3/lib/api.ts" "Frontend API client"

echo ""

# Check backend files
check_file "../GeekBackend/GeekAPI/Program.cs" "GeekAPI entry point"
check_file "../GeekBackend/GeekRepository/Program.cs" "GeekRepository entry point"
check_file "../GeekBackend/GeekApplication/Models/ContentWriterV3/CampaignDtos.cs" "Shared DTOs"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 3: Checking Documentation"
echo "═══════════════════════════════════════════════════════════════"
echo ""

check_file "QUICKSTART.md" "Quick start guide"
check_file "DEPLOYMENT.md" "Deployment guide"
check_file "API_REFERENCE.md" "API reference"
check_file "LAUNCH_CHECKLIST.md" "Launch checklist"
check_file "MONITORING_GUIDE.md" "Monitoring guide"
check_file "TEAM_HANDOFF.md" "Team handoff document"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 4: Checking Build Status"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if projects can be built
echo -n "Checking GeekAPI can be built... "
if cd ../GeekBackend && dotnet build GeekAPI/GeekAPI.csproj --nologo -q 2>/dev/null; then
    echo -e "${GREEN}✓ Builds${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ Build Failed${NC}"
    ((CHECKS_FAILED++))
fi

echo -n "Checking GeekRepository can be built... "
if dotnet build GeekRepository/GeekRepository.csproj --nologo -q 2>/dev/null; then
    echo -e "${GREEN}✓ Builds${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ Build Failed${NC}"
    ((CHECKS_FAILED++))
fi

cd - > /dev/null

echo -n "Checking Frontend can be built... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Builds${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗ Build Failed${NC}"
    ((CHECKS_FAILED++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 5: Checking Database"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if PostgreSQL is running
echo -n "Checking PostgreSQL is running... "
if psql -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ Warning${NC}"
    echo "  → PostgreSQL not accessible (may not be needed for static checks)"
fi

# Check if database exists
echo -n "Checking content_writer_v3 database exists... "
if psql -U postgres -d content_writer_v3 -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Exists${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠ Warning${NC}"
    echo "  → Database not found (will be created on first run)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "STEP 6: Checking Running Services (if started)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Only check if services are running, don't fail if they're not
echo "Checking if services are currently running..."
echo -n "  GeekRepository (5050): "
if curl -s http://localhost:5050/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}• Not running (start it to test)${NC}"
fi

echo -n "  GeekAPI (5000/8080): "
if curl -s http://localhost:5000/health > /dev/null 2>&1 || curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}• Not running (start it to test)${NC}"
fi

echo -n "  Frontend (3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}• Not running (start it to test)${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "VERIFICATION SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""

TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))

echo "Checks Passed: ${GREEN}${CHECKS_PASSED}${NC}"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo "Checks Failed: ${RED}${CHECKS_FAILED}${NC}"
else
    echo "Checks Failed: ${GREEN}0${NC}"
fi
echo "Total Checks:  $TOTAL"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "NEXT STEPS:"
    echo "1. Read QUICKSTART.md to start services locally"
    echo "2. Follow local testing instructions"
    echo "3. Review TEAM_HANDOFF.md for team onboarding"
    echo ""
else
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}✗ Some checks failed. See details above.${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "TROUBLESHOOTING:"
    echo "1. Install missing prerequisites"
    echo "2. Check that database is running: psql -U postgres"
    echo "3. Create database: createdb content_writer_v3"
    echo "4. See DEPLOYMENT.md for detailed setup"
    echo ""
    exit 1
fi
