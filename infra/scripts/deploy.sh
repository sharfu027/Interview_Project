#!/usr/bin/env bash
# ==============================================================================
# InterviewOS - Production Deployment Automation Script (Non-Docker)
# ==============================================================================
set -euo pipefail

APP_ROOT="/opt/interviewos"
DEPLOY_DATE=$(date +%Y%m%d_%H%M%S)

echo "=== [1/5] Starting InterviewOS Deployment (${DEPLOY_DATE}) ==="

# Check requirements
command -v java >/dev/null 2>&1 || { echo "Java 21 LTS is required but not installed. Aborting."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3.11+ is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js 20+ is required but not installed. Aborting."; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL client is required. Aborting."; exit 1; }

echo "=== [2/5] Building Python FastAPI AI Service ==="
cd "${APP_ROOT}/ai-service"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python -m pytest tests/ -v
deactivate

echo "=== [3/5] Building Spring Boot Core Monolith ==="
cd "${APP_ROOT}/backend"
./mvnw clean package -DskipTests=false
cp target/interviewos-backend-*.jar /opt/interviewos/backend/interviewos-backend.jar

echo "=== [4/5] Building Frontend React SPA ==="
cd "${APP_ROOT}/frontend"
npm ci
npm run build

echo "=== [5/5] Reloading System Services Gracefully ==="
sudo systemctl daemon-reload
sudo systemctl restart interviewos-ai.service
sudo systemctl restart interviewos-backend.service

# Verify health status
sleep 5
echo "Verifying service status..."
sudo systemctl is-active --quiet interviewos-ai.service && echo "FastAPI AI Service: ACTIVE" || echo "FastAPI AI Service: FAILED"
sudo systemctl is-active --quiet interviewos-backend.service && echo "Spring Boot Service: ACTIVE" || echo "Spring Boot Service: FAILED"

echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=== Deployment Completed Successfully at $(date) ==="
