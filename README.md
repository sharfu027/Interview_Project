# InterviewOS | Premium AI Interview & Career Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Java Version](https://img.shields.io/badge/Java-21%20LTS-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Theme](https://img.shields.io/badge/Theme-Light%20Only-f8fafc.svg)](#)

**InterviewOS** is a complete, enterprise-grade AI interview preparation, interview intelligence, and recruitment SaaS platform. Built as a high-performance modular monolith (Java 21 LTS + Spring Boot 3.4) coupled with an asynchronous Python 3.12 FastAPI AI microservice and a React 19 frontend featuring an interactive Three.js 3D hero scene.

---

## 1. Product Vision & Three Major Pillars

1. **Prepare (Career Intelligence):**
   - **ATS Resume Intelligence**: Deep syntactic parsing, keyword coverage percentage, quantifiable metrics audit, and AI STAR bullet enhancer.
   - **Company-Specific Dossiers**: Deconstructed interview stages and non-negotiable concepts for Stripe, Google, Netflix, and more.
   - **Job Market & Match Engine**: Live jobs with ATS match index and direct simulation launchers.
   - **Curated Question Bank & Coding Lab**: 50+ high-yield questions with reference answers, plus an in-browser algorithmic/concurrency coding sandbox.

2. **Practise (AI Interview Chamber):**
   - **Interactive Mock Interviews**: Tailored simulations with live WebRTC camera preview, interviewer audio playback, and STAR answer recording.
   - **Real-Time Speaking Coach HUD**: Live pacing gauge (WPM), filler-word detector (`um`, `uh`, `like`, `basically`), and monologue prevention alerts.
   - **4-Persona AI Executive Panel**: Turn-by-turn cross-examination featuring Priya Sharma (Talent & Culture), Alex Chen (Staff Tech Lead), Marcus Vance (VP Engineering), and Dr. Elena Rostova (Chief Architect).
   - **Instant AI Rubric Evaluation**: Instant criterion scoring (Technical Correctness, Reasoning Structure, Communication Clarity, Awareness of Trade-offs) and concrete polish recommendations.
   - **Official Comprehensive Scorecards**: Competency matrix, strengths, priority action items, turn-by-turn question analysis, and PDF export.

3. **Improve (Longitudinal Growth):**
   - **Longitudinal Weakness Detector**: Aggregates interview hesitation patterns, hedging habits, and architectural blind spots over time.
   - **Personalized Career Roadmaps**: Milestone-driven curriculum mapped to Staff and Senior competency frameworks.
   - **Statistical Salary Intelligence**: Verified compensation bands from 2026 tech aggregates and SEC filings with an AI counter-offer negotiation simulator.
   - **Application Pipeline Tracker**: Full recruitment kanban/table organizing applications, recruiter contacts, and stage debrief notes.

4. **Recruiter & Admin Workspace:**
   - **Recruiter Portal**: Manage requisition pipelines, review talent rosters with ATS scores, and inspect verified candidate mock scorecards.
   - **Structured Evaluation Scorecards**: Standardized interview signals and hiring recommendations (`STRONG_HIRE`, `HIRE`, `LEANING_HIRE`, `NO_HIRE`).
   - **System Telemetry & Health**: Live node monitoring for PostgreSQL, Spring Boot, FastAPI, and STT engines.

---

## 2. Default Seeded Accounts (PostgreSQL Migration V7)

| Account Role | Email Address | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@interviewos.dev` | `Password123!` | Full access to Candidate Suite, mock interviews, 4-persona panel, resume tools, roadmaps. |
| **Recruiter** | `recruiter@interviewos.dev` | `Password123!` | Full access to Recruiter Workspace, job creation, candidate roster, and scorecard evaluations. |
| **Admin** | `admin@interviewos.dev` | `Password123!` | System-wide operational observability, metrics telemetry, and user management. |

---

## 3. Technology Stack & Directory Structure

```
interviewos/
├── backend/                  # Java 21 LTS + Spring Boot 3.4.2 Modular Monolith
│   ├── src/main/java/        # Security, Auth, Resumes, Jobs, Interviews, Panel, Learning, Recruiter
│   ├── src/main/resources/   # application.yml & db/migration/ (Flyway V1 - V7)
│   └── pom.xml               # Maven Project Configuration
├── ai-service/               # Python 3.12 + FastAPI AI & Media Microservice
│   ├── app/                  # Main FastAPI application, Pydantic schemas, and AI orchestrators
│   ├── tests/                # Automated pytest test suite
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/components/       # 3D R3F Hero Scene, Common Layouts
│   ├── src/pages/            # Public, Candidate App, Recruiter Portal, Admin
│   ├── src/services/api.ts   # Typed API client with offline fallback
│   └── vite.config.ts        # Vite Bundler Configuration
├── database/migrations/      # Canonical SQL Flyway migrations (71 tables)
├── infra/                    # Non-Docker Production Infrastructure
│   ├── systemd/              # Linux systemd service units
│   ├── nginx/                # Hardened TLS reverse proxy configuration
│   └── scripts/              # Automated bash deployment script
└── docs/                     # Comprehensive architecture and security documentation
```

---

## 4. Local Development Quickstart (Non-Docker)

### Prerequisites
- **JDK 21 LTS** (or Java 25)
- **Apache Maven 3.9+**
- **Python 3.11+**
- **Node.js 20+** and **npm**
- **PostgreSQL 16** running locally on port 5432

### Step 1: Database Setup
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE interviewos;"
```

### Step 2: Run Core Spring Boot Monolith
```bash
cd backend
mvn clean test
mvn spring-boot:run
```
*The Spring Boot backend will boot on `http://localhost:8080`, automatically execute all 7 Flyway migrations, seed demo accounts, and expose REST APIs under `/api/v1`.*

### Step 3: Run Python FastAPI AI Microservice
```bash
cd ai-service
python -m venv venv
# On Windows: venv\Scripts\activate | On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python -m pytest tests -v
uvicorn app.main:app --reload --port 8000
```
*The AI microservice will start on `http://localhost:8000`.*

### Step 4: Run React Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
npm run dev
```
*Open your browser at `http://localhost:5173` to experience the complete platform.*

---

## 5. Automated Verification & Testing

- **Backend Tests**: Run `mvn test` in `backend/` (runs Spring Boot context loads, Flyway migration tests, and service unit tests).
- **AI Service Tests**: Run `python -m pytest tests -v` in `ai-service/` (validates ATS scoring, STAR interview evaluations, and panel orchestrator logic).
- **Frontend Build**: Run `npm run build` in `frontend/` (executes strict `tsc -b` type checking and Vite production bundling).

---

## 6. Non-Docker Production Deployment

InterviewOS is designed to deploy directly onto bare-metal or cloud Linux servers (Ubuntu/Debian) using `systemd` and `nginx`:

1. **Systemd Services**:
   - Copy `infra/systemd/interviewos-backend.service` to `/etc/systemd/system/`
   - Copy `infra/systemd/interviewos-ai.service` to `/etc/systemd/system/`
   - Enable services: `sudo systemctl enable interviewos-backend interviewos-ai`
2. **Nginx Reverse Proxy**:
   - Copy `infra/nginx/interviewos.conf` to `/etc/nginx/sites-available/interviewos.conf`
   - Link to `sites-enabled` and reload: `sudo nginx -t && sudo systemctl reload nginx`
3. **Automated Deployment**:
   - Run `bash infra/scripts/deploy.sh` to trigger builds, test execution, and zero-downtime service reloads.

---

## 7. License

Proprietary & Confidential &copy; 2026 InterviewOS. All rights reserved.
