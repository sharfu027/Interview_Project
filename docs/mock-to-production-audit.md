# InterviewOS — Mock Data & Real-Time Integration Audit Report

**Audit Date:** October 2026  
**Auditors:** Senior Full-Stack Architect, AI Platform Engineer, Application Security Engineer  
**Scope:** Complete repository inspection (`backend/`, `ai-service/`, `frontend/`, `database/`, and configuration)  
**Target Git Repository:** `https://github.com/sharfu027/Interview_Project.git`  
**Execution Context:** Non-Docker environment (Bare processes / systemd), Light Theme UI, Java 21 / Spring Boot 3.4.2, Python 3.11 / FastAPI, React 18.3 / Vite 6, PostgreSQL 16.

---

## 1. Executive Summary & Audit Methodology

InterviewOS is currently a functional, end-to-end full-stack web application. Automated unit and integration test suites pass across all layers:
- **Backend (Spring Boot):** 17 / 17 passed (`mvn test`)
- **AI Service (FastAPI):** 5 / 5 passed (`pytest`)
- **Frontend (React / Vite):** 11 / 11 passed (`npm test`), production build successful (`npm run build`)
- **Database (PostgreSQL 16):** 8 Flyway migrations applied cleanly (`V1` through `V8`, 72 relational tables)

However, an exhaustive line-by-line inspection of controllers, services, repositories, schemas, and React components reveals that while the core relational data layer (Auth, Profiles, Resumes, Applications, Recruiter, Roadmaps) is backed by PostgreSQL, **all AI intelligence, speech analytics, salary insights, market jobs, and coding executions currently operate on deterministic rule heuristics, static fallback fixtures, client-side simulations, or isolated mock provider stubs**.

The application does not currently make live outbound calls to any external third-party API or commercial LLM provider.

### Audit Status Legend
- **REAL_DATABASE:** Persistent, relational CRUD backed by PostgreSQL with real user ownership and tenant isolation.
- **REAL_LOCAL_PROCESSING:** Real in-process computational processing (e.g., file disk I/O, DOCX/PDF binary extraction, regex parsing).
- **REAL_EXTERNAL_API:** Live HTTP/gRPC client integration with a third-party external service.
- **REAL_AI_PROVIDER:** Live integration with OpenAI, Anthropic, or Google Gemini API.
- **PARTIAL:** Hybrid implementation where real database/local parsing exists, but intelligence, scoring, or data is backed by local heuristics or fixed multiplier rules rather than live models/data.
- **MOCK:** Completely simulated behavior (e.g. `setTimeout` client simulation, static test results, mock provider stubs).
- **STATIC:** Hardcoded business values, dialogue turns, or telemetry strings directly in source code.
- **SEEDED_DEMO_DATA:** Development fixtures inserted via Flyway or auto-seeded when database tables are empty.

---

## 2. Comprehensive Feature Classification Table

| # | Feature | Frontend Entry Point | Backend Endpoint / Service | Data Source / Processing Engine | Current Status | Production Requirement |
|---|---|---|---|---|---|---|
| 1 | **User Registration & Login** | `LoginPage.tsx`, `RegisterPage.tsx` | `AuthController.java` $\to$ `AuthService.java` | PostgreSQL (`users`, `user_roles`, `roles`) with BCrypt + JWT | **REAL_DATABASE** | Keep; production database already configured |
| 2 | **User Profile & Settings** | `ProfilePage.tsx`, `SettingsPage.tsx` | `UserController.java` $\to$ `UserService.java` | PostgreSQL (`user_profiles`, `user_settings`) | **REAL_DATABASE** | Keep; relational persistence verified |
| 3 | **Resume Binary Upload & Storage** | `ResumeUploadPage.tsx` | `ResumeController.java` $\to$ `LocalFileStorageService.java` | Local Filesystem (`./storage/uploads/resumes/`) | **REAL_LOCAL_PROCESSING** | Migrate to AWS S3 or Google Cloud Storage in production |
| 4 | **Resume Document Parsing** | `ResumeDetailPage.tsx` | `ResumeService.java` $\to$ `DocumentParserService.java` | Local Apache POI / PDFBox stream extraction | **REAL_LOCAL_PROCESSING** | Keep local text extractor; supplement with OCR (AWS Textract / Tesseract) for scanned PDFs |
| 5 | **Resume Skill & ATS Scoring** | `ResumeDetailPage.tsx` | `ai-service` $\to$ `resume_analyzer.py` | Local regex heuristic dictionary & impact scoring | **PARTIAL** | Wire to live LLM (`gpt-4o` / `claude-3-5-sonnet` / `gemini-1.5-pro`) for semantic resume critique |
| 6 | **Mock Interview Session Lifecycle** | `InterviewSetupPage.tsx`, `InterviewPage.tsx` | `InterviewController.java` $\to$ `InterviewService.java` | PostgreSQL (`interview_sessions`, `interview_questions`) | **REAL_DATABASE** | Keep database lifecycle; connect questions and evaluations to live LLM |
| 7 | **Interview Question Bank & Selection** | `InterviewPage.tsx` | `ai-service` $\to$ `interview_orchestrator.py` | Static Python dictionaries (`ROLE_QUESTION_BANKS`) | **PARTIAL** | Implement dynamic LLM question generation conditioned on candidate resume and job description |
| 8 | **Answer Evaluation & Rubric Feedback** | `InterviewPage.tsx`, `InterviewReportPage.tsx` | `ai-service` $\to$ `interview_orchestrator.py` | Local keyword matching, word count heuristics, regex trade-off checks | **PARTIAL** | Implement multi-turn LLM evaluator with structured JSON outputs and domain evaluation rubrics |
| 9 | **Executive 4-Persona AI Panel** | `AIPanelPage.tsx` | `PanelController.java` $\to$ `PanelService.java` | Backend Java switch statement with hardcoded turn strings (Turns 1, 3, 5, 7) | **STATIC / MOCK** | Connect to multi-persona LLM agent orchestrator with system prompts per persona; fix frontend UUID bug |
| 10 | **Speech Metrics & Real-Time Coaching** | `SpeakingCoachPage.tsx` | `SpeakingCoachPage.tsx` (client timer) & `speaking_coach.py` | Client `Math.random()` WPM generator + client regex filler matching | **MOCK / PARTIAL** | Integrate real browser Web Audio recording + Whisper / Deepgram real-time streaming STT |
| 11 | **Audio/Video Recording Upload** | `InterviewPage.tsx` | `MediaController.java` $\to$ `LocalFileStorageService.java` | Local Filesystem (`./storage/uploads/recordings/`) | **REAL_LOCAL_PROCESSING** | Connect to S3/Cloud Storage presigned multipart upload |
| 12 | **Job Market Search & Postings** | `JobSearchPage.tsx` | `JobController.java` $\to$ `JobService.java` | PostgreSQL (`job_postings`) seeded with Stripe/Netflix sample records | **SEEDED_DEMO_DATA** | Integrate live job provider API (e.g. Adzuna, JSearch / RapidAPI, USAJobs, Jooble) |
| 13 | **Company Preparation Guides** | `CompanyPrepPage.tsx` | `JobController.java` $\to$ `JobService.java` | Hardcoded fallback object in `JobService.java` (`getCompanyPrep`) | **SEEDED_DEMO_DATA / STATIC** | Integrate real company dataset / Glassdoor API / LLM-synthesized company interview debriefs |
| 14 | **Salary Intelligence & Market Benchmarks** | `SalaryCalculatorPage.tsx` | `SalaryController.java` $\to$ `SalaryService.java` & `salary_estimator.py` | 3 seeded PostgreSQL rows + Python fixed multiplier formula ($185k $\times$ 0.65-1.55) | **SEEDED_DEMO_DATA / PARTIAL** | Connect to live salary data feed (e.g. Levels.fyi aggregates, Bureau of Labor Statistics OES, H1B disclosures) |
| 15 | **In-Browser Technical Coding Lab** | `CodingLabPage.tsx` | None (Client-side only) | Client-side `setTimeout` (800ms) with static "PASSED" output | **MOCK** | Build backend isolated sandbox runner (Docker / Firecracker / Judge0 / WebAssembly runner) |
| 16 | **Job Application Tracker (Kanban / List)** | `ApplicationsPage.tsx` | `JobController.java` $\to$ `JobService.java` | PostgreSQL (`job_applications`) with 1 Google demo record seeded on empty | **REAL_DATABASE** | Keep; disable automatic demo record insertion when `DEMO_MODE=false` |
| 17 | **Weakness Detection & Adaptive Guidance** | `WeaknessesPage.tsx`, `DashboardPage.tsx` | `LearningController.java` $\to$ `LearningService.java` | PostgreSQL (`identified_weaknesses`); auto-seeded per target role if empty | **REAL_DATABASE** | Keep database model; populate weaknesses exclusively from live LLM evaluation scores |
| 18 | **Career Learning Roadmaps** | `RoadmapsPage.tsx`, `RoadmapDetailPage.tsx` | `LearningController.java` $\to$ `LearningService.java` | PostgreSQL (`career_roadmaps`, `roadmap_milestones`); auto-seeded per role | **REAL_DATABASE** | Keep database schema; allow LLM generation of tailored roadmaps based on interview weaknesses |
| 19 | **Recruiter Requisition Management** | `RecruiterJobsPage.tsx` | `RecruiterController.java` $\to$ `RecruiterService.java` | PostgreSQL (`recruiter_jobs`) with RBAC enforcement (`ROLE_RECRUITER`) | **REAL_DATABASE** | Keep; production ready |
| 20 | **Candidate Evaluation Scorecards** | `RecruiterCandidatesPage.tsx` | `RecruiterController.java` $\to$ `RecruiterService.java` | PostgreSQL (`recruiter_candidates`, `evaluation_scorecards`) | **REAL_DATABASE** | Keep; production ready |
| 21 | **Admin Operational Telemetry** | `AdminHealthPage.tsx` | `AdminController.java` $\to$ `AdminService.java` | PostgreSQL counts + hardcoded latency (28ms) and static status strings | **PARTIAL** | Replace static strings with live health checks (Micrometer, Redis ping, AI health probe) |

---

## 3. Subsystem Deep-Dive & Exact Code Locations

### 3.1 Python AI Service (`ai-service/`)

#### A. Provider Layer (`ai-service/app/providers/`)
- **`app/providers/base.py`:** Defines abstract classes `BaseLLMProvider` and `BaseSTTProvider`.
- **`app/providers/mock_provider.py`:** Contains `MockLLMProvider` and `MockSTTProvider`.
  - Lines 8–38: `MockLLMProvider.generate_completion()` checks `prompt_lower` for `"resume"` or `"evaluate"` and returns static JSON strings.
  - Lines 41–51: `MockSTTProvider.transcribe_audio()` returns a static transcript `"In our microservices architecture..."` with fixed WPM (134.4).
- **Wiring Gap:** Neither `MockLLMProvider` nor any real provider is actually instantiated or invoked by the services in `app/services/`. The services currently implement their own internal heuristics.

#### B. Resume Analyzer (`ai-service/app/services/resume_analyzer.py`)
- **Execution Mechanism:** Real local parsing and deterministic heuristics.
  - Extracts raw text from parsed resume payload.
  - Scans against predefined keyword sets (`CORE_TAXONOMY`: Java, Python, Go, React, Kafka, Kubernetes, etc.).
  - Calculates ATS score via formula:
    $$\text{score} = \min(95.0, 50.0 + (\text{matched\_skills} \times 3.0) + \text{quantifiable\_boost} + \text{action\_verbs\_boost})$$
- **Production Status:** `PARTIAL`. Solid deterministic baseline, but lacks contextual critique, semantic gap analysis, or JD-to-resume matching provided by modern LLMs.

#### C. Interview Orchestrator (`ai-service/app/services/interview_orchestrator.py`)
- **Question Generation (Lines 9–280):**
  - Contains `ROLE_QUESTION_BANKS` dictionary with hardcoded questions for `FRONTEND`, `BACKEND`, `FULLSTACK`, `DEVOPS`, `QA`, `DATA`, and `BEHAVIORAL` across `JUNIOR`, `MID`, `SENIOR`, and `STAFF` tiers.
  - Deterministically selects 3–5 questions matching the requested role and difficulty.
- **Answer Evaluation (Lines 300–420):**
  - Uses `domain_keywords` dictionary (20 terms: `volatile`, `happens-before`, `barrier`, `idempotent`, `mvcc`, `lcp`, etc.).
  - Checks regex for trade-offs:
    `\b(trade-?off|however|conversely|compromise|overhead|latency vs|cost vs|bottleneck|downside)\b`
  - Computes numerical score via linear formula:
    $$\text{overall} = \frac{\text{tech\_score} + \text{reasoning\_score} + \text{clarity\_score} + \text{tradeoff\_depth}}{4.0}$$
  - Synthesizes feedback strings using string interpolation.
- **Production Status:** `PARTIAL`.

#### D. Panel Orchestrator (`ai-service/app/services/panel_orchestrator.py`)
- **Turn Generation (Lines 4–69):**
  - Uses hardcoded `if next_turn == 3: ... elif next_turn == 5: ... elif next_turn == 7: ...`.
  - Returns hardcoded dialogue questions for Tech Lead (Alex), Chief Architect (Elena), VP of Eng (Marcus), and HR (Priya).
- **Production Status:** `STATIC / MOCK`. Furthermore, backend `PanelService.java` does not even call this endpoint; it repeats the same hardcoded switch logic in Java!

#### E. Speaking Coach (`ai-service/app/services/speaking_coach.py`)
- **Execution Mechanism (Lines 8–57):**
  - Takes `transcript_text` and `duration_seconds`.
  - Calculates WPM: $\text{words} / (\text{duration\_seconds} / 60.0)$.
  - Counts filler words via regex: `["um", "uh", "like", "you know", "actually", "basically", "sort of", "kind of", "right"]`.
  - Calculates clarity score: $\max(5.0, 10.0 - (\text{fillers} / \text{words} \times 25.0))$.
- **Production Status:** `REAL_LOCAL_PROCESSING` on text, but lacks speech-to-text audio ingestion.

#### F. Salary Estimator (`ai-service/app/services/salary_estimator.py`)
- **Execution Mechanism (Lines 4–37):**
  - Uses fixed multiplier table: Entry 0.65, Mid 0.85, Senior 1.0, Lead 1.18, Staff 1.35, Principal 1.55 on a static base median of \$185,000 USD.
- **Production Status:** `STATIC / PARTIAL`.

---

### 3.2 Java Backend Service (`backend/`)

#### A. Identity, Auth & Recruiter Workspaces
- `AuthController.java`, `UserService.java`, `RecruiterService.java`, `ResumeService.java`
- Full database persistence, JPA transactions, Flyway migrations, and Spring Security RBAC.
- **Production Status:** `REAL_DATABASE`.

#### B. Panel Service (`backend/src/main/java/com/interviewos/panel/service/PanelService.java`)
- **Lines 59–65:** Initial question from HR persona is hardcoded in Java.
- **Lines 96–110:**
  - Turn 3 prompt from Tech Lead (Alex Chen) is hardcoded string.
  - Turn 5 challenge from Chief Architect (Elena Rostova) is hardcoded string.
  - Turn 7 negotiation prompt from VP of Engineering (Marcus Vance) is hardcoded string.
  - Turn 9 closing from HR is hardcoded string.
- **Production Status:** `STATIC`.

#### C. Job Service (`backend/src/main/java/com/interviewos/job/service/JobService.java`)
- **Lines 51–54 & 189–215 (`seedSampleJobsIfEmpty`):** When `job_postings` table is empty, auto-inserts Stripe and Netflix postings.
- **Lines 69–80 (`getCompanyPrep`):** If company slug is not found in database, returns hardcoded Stripe overview and interview stages.
- **Lines 98–112 (`listApplications`):** If user has 0 job applications, auto-creates a demo application for Google Staff Software Engineer.
- **Production Status:** `SEEDED_DEMO_DATA / STATIC`.

#### D. Salary Service (`backend/src/main/java/com/interviewos/salary/service/SalaryService.java`)
- **Lines 30–33 & 70–106 (`seedSampleSalaryData`):** When `salary_observations` table is empty, auto-seeds 3 sample rows.
- **Lines 35–47:** Falls back to hardcoded \$175,000 median with sample size 420 and static SEC disclosure citation.
- **Production Status:** `SEEDED_DEMO_DATA`.

#### E. Learning Service (`backend/src/main/java/com/interviewos/learning/service/LearningService.java`)
- **Lines 89–95 & 270–353 (`seedRealWeaknessesForRole`):** Auto-inserts 2 pre-written weaknesses if candidate has none.
- **Lines 355–420 (`seedRealRoadmapForRole`):** Auto-inserts pre-written roadmaps and milestones if candidate has none.
- **Production Status:** `REAL_DATABASE` (with automatic seed fallback on first query).

#### F. Admin Service (`backend/src/main/java/com/interviewos/admin/service/AdminService.java`)
- **Lines 26–32:** Hardcodes service status strings:
  `"whisper_stt_engine": "UP (Active - Ready)"`
  `"llm_orchestrator": "UP (Active - Multi-Provider Fallback Active)"`
- **Lines 34–40:** Hardcodes telemetry metrics:
  `"system_uptime_seconds": 38400`, `"average_api_latency_ms": 28`
- **Production Status:** `PARTIAL`.

---

### 3.3 Frontend Client (`frontend/`)

#### A. Technical Coding Lab (`frontend/src/pages/app/CodingLabPage.tsx`)
- **Lines 135–153 (`handleRunTests`):**
  ```ts
  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      setTestOutput({
        status: "PASSED",
        testsRun: 8,
        testsPassed: 8,
        executionTimeMs: 14,
        memoryUsageMb: 24.2,
        logs: [
          "Running Test Case 1: Sequential put() and get() ... PASSED (2ms)",
          "Running Test Case 2: Capacity boundary eviction ... PASSED (1ms)",
          "Running Test Case 3: Key overwrite semantics ... PASSED (1ms)",
          "Running Test Case 4: Concurrent multithreaded read/write test ... PASSED (10ms)",
        ],
      });
      setRunning(false);
    }, 800);
  };
  ```
- **Finding:** Completely mocked on the client. No request is sent to backend; code changes do not affect the output.

#### B. AI Panel Page (`frontend/src/pages/app/AIPanelPage.tsx`)
- **Line 24:** Calls `api.panel.getSession("panel-session-1")`.
- **Finding:** `"panel-session-1"` is an invalid UUID. The backend endpoint `GET /api/v1/ai-panel/sessions/{interviewSessionId}` rejects it. The frontend `catch` block in `api.ts` catches the failure and silently falls back to hardcoded mock panel state!

#### C. Real-Time Speaking Coach Lab (`frontend/src/pages/app/SpeakingCoachPage.tsx`)
- **Line 36:** `setCurrentWpm(Math.floor(130 + Math.random() * 20));` generates random WPM every second.
- **Lines 56–70:** `simulateSpeechInput` analyzes preset hardcoded text snippets using client-side regex. No actual microphone audio is captured or sent to an STT model.

#### D. API Catch Fallbacks (`frontend/src/services/api.ts`)
- Almost every method in `frontend/src/services/api.ts` contains a `try { return await request(...) } catch { return <MOCK_FIXTURE> }` block.
- While useful for offline demo stability, this masks backend errors (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found) by transparently returning hardcoded dummy data.

---

## 4. Current AI Provider Architecture in Python Service

In `ai-service/app/core/config.py`:
```python
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock") # mock, openai, gemini, anthropic
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
STT_PROVIDER: str = os.getenv("STT_PROVIDER", "mock") # mock, whisper, deepgram
```

However, in `ai-service/app/services/`:
- `resume_analyzer.py` does NOT import or call `LLMProvider`.
- `interview_orchestrator.py` does NOT import or call `LLMProvider`.
- `panel_orchestrator.py` does NOT import or call `LLMProvider`.
- `speaking_coach.py` does NOT import or call `STTProvider`.

### Architectural Defect
The provider abstractions in `app/providers/base.py` exist as stubs, but the services were built as standalone heuristic rule engines. To support true production AI intelligence, the services must be refactored into a **Provider Injection Pattern** that queries the configured provider with strict schema validation.

---

## 5. Summary Statistics

| Classification | Count | Features Included |
|---|---|---|
| **REAL_DATABASE** | 8 | Auth & JWT, User Profiles, Settings, Applications, Weaknesses, Roadmaps, Recruiter Jobs, Recruiter Evaluations |
| **REAL_LOCAL_PROCESSING** | 2 | Resume File Storage (Disk), Binary Resume Extraction (PDF/DOCX) |
| **PARTIAL** | 5 | Resume ATS Analysis, Interview Question Bank, Answer Evaluation, Speaking Coach Text Metrics, Admin Health |
| **SEEDED_DEMO_DATA** | 3 | Job Postings, Company Intelligence, Salary Observations |
| **STATIC / MOCK** | 3 | Executive AI Panel, Speaking Coach Voice Input, Coding Lab Runner |
| **REAL_EXTERNAL_API** | 0 | None currently active |
| **REAL_AI_PROVIDER** | 0 | None currently active |
| **TOTAL AUDITED** | 21 | Full platform footprint |

---

## 6. Audit Verdict

InterviewOS has a robust, enterprise-grade foundation: its database schema, JWT security, transactional Spring Boot backend, and React UI are real, resilient, and well-structured.

However, **all features requiring external intelligence (LLM, STT, Job Postings, Salary Benchmarks, Code Sandbox) currently operate in simulated, seeded, or heuristic modes**.

To transform InterviewOS into a true real-time production platform, the engineering team must follow the step-by-step implementation roadmap detailed in [`docs/mock-to-production-roadmap.md`](file:///x:/hashmat/docs/mock-to-production-roadmap.md).
