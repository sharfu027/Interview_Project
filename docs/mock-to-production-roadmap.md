# InterviewOS — Mock-to-Production Implementation Roadmap

**Document Version:** 1.0.0  
**Target Milestone:** Production Real-Time Readiness  
**Target Git Repository:** `https://github.com/sharfu027/Interview_Project.git`  
**Execution Context:** Non-Docker application host (Bare processes / systemd), Light Theme UI, Java 21 / Spring Boot 3.4.2, Python 3.11 / FastAPI, React 18.3 / Vite 6, PostgreSQL 16.

---

## 1. Executive Roadmap Architecture

The transition from deterministic heuristics and mock fixtures to live production services is structured into three prioritized phases:

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE A: Critical AI & Core Evaluation Engine                          │
│ 1. Multi-Provider LLM Abstraction (OpenAI, Anthropic, Gemini, Mock)   │
│ 2. Real STT Provider (OpenAI Whisper / Deepgram Live Streaming)       │
│ 3. Real 4-Persona AI Panel Orchestrator & Frontend UUID Bug Fix        │
│ 4. Semantic Resume Critique & Adaptive Question Generator             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ PHASE B: Data & Market Intelligence Engine                             │
│ 1. Live Job Market Feed (Adzuna / JSearch API + Redis Cache)           │
│ 2. Verified Salary Data Integration (BLS OES / Levels.fyi Aggregates) │
│ 3. Real Company Intelligence & Interview Debrief Aggregator            │
│ 4. Production Seed Disablement Flag (`DEMO_MODE=false`)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ PHASE C: Execution Sandbox & Media Infrastructure                      │
│ 1. Secure Isolated Code Execution Runner (Judge0 / Piston / gVisor)   │
│ 2. Production Object Storage (AWS S3 / Cloudflare R2 / GCS Presigned)  │
│ 3. WebSocket Real-Time Audio & Interview Event Streaming               │
│ 4. Production Telemetry & Live Health Probes (Micrometer + Actuator)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase A: Critical AI & Core Evaluation Engine

### A.1 Multi-Provider LLM Abstraction & Integration

#### Purpose & Goal
Replace in-process regex heuristics and keyword scoring in `ai-service` with a unified LLM provider factory that can seamlessly switch between OpenAI (`gpt-4o`, `gpt-4o-mini`), Anthropic (`claude-3-5-sonnet`), Google Gemini (`gemini-1.5-pro`, `gemini-1.5-flash`), and a local deterministic mock for testing.

#### Concrete Provider Architecture
```
                     ┌───────────────────────────┐
                     │      BaseLLMProvider      │
                     │  +generate_completion()   │
                     │  +generate_json()         │
                     └─────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
┌────────▼────────┐       ┌────────▼────────┐       ┌────────▼────────┐
│  OpenAIProvider │       │AnthropicProvider│       │ GeminiProvider  │
│ (openai Python) │       │ (anthropic SDK) │       │(google-genai)   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
                          ┌────────▼────────┐
                          │  MockLLMProvider│
                          │(Deterministic)  │
                          └─────────────────┘
```

#### Detailed Item Specifications
- **Files to Modify / Create:**
  - `ai-service/app/providers/base.py`: Expand `BaseLLMProvider` with `generate_json(prompt, schema, system_prompt)`.
  - `ai-service/app/providers/openai_provider.py`: Implement OpenAI client using `openai>=1.30.0` with structured outputs (`response_format={"type": "json_object"}`).
  - `ai-service/app/providers/anthropic_provider.py`: Implement Anthropic client using `anthropic>=0.25.0` with system prompts.
  - `ai-service/app/providers/gemini_provider.py`: Implement Google Gemini client using `google-generativeai>=0.7.0` with `generation_config={"response_mime_type": "application/json"}`.
  - `ai-service/app/providers/factory.py`: Create `get_llm_provider()` reading `AI_PROVIDER` (`openai`, `anthropic`, `gemini`, `mock`).
  - `ai-service/app/services/resume_analyzer.py`: Inject LLM provider to extract deep ATS critique, formatting flaws, and missing role keywords.
  - `ai-service/app/services/interview_orchestrator.py`: Inject LLM provider to generate unscripted questions matching the candidate's exact resume and evaluate answers against a professional multi-factor rubric.
  - `ai-service/requirements.txt`: Add `openai`, `anthropic`, `google-generativeai`.
- **External APIs Required:**
  - OpenAI API (`https://api.openai.com/v1`)
  - Anthropic API (`https://api.anthropic.com/v1`)
  - Google Gemini API (`https://generativelanguage.googleapis.com/v1beta`)
- **Environment Variables:**
  - `AI_PROVIDER`: `openai` | `anthropic` | `gemini` | `mock`
  - `OPENAI_API_KEY`: Secret API key (starts with `sk-proj-`)
  - `OPENAI_MODEL`: `gpt-4o` or `gpt-4o-mini` (default: `gpt-4o-mini`)
  - `ANTHROPIC_API_KEY`: Secret API key (starts with `sk-ant-`)
  - `ANTHROPIC_MODEL`: `claude-3-5-sonnet-20240620` (default)
  - `GEMINI_API_KEY`: Secret API key (starts with `AIzaSy`)
  - `GEMINI_MODEL`: `gemini-1.5-pro` or `gemini-1.5-flash` (default: `gemini-1.5-flash`)
  - `AI_REQUEST_TIMEOUT_SECONDS`: `30`
- **Database Changes:** None. Relational schemas in `interview_questions`, `question_evaluations`, and `resumes` already support JSON payloads and numeric scores.
- **Security Concerns:**
  - API keys must never be committed to git or exposed to the frontend.
  - Prompt injection mitigation: user-submitted resumes and answers must be sanitized and wrapped in protective system boundaries (e.g. `"""Candidate Answer"""`).
  - Rate limiting outbound LLM requests to prevent API quota exhaustion and unexpected billing spikes.
- **Implementation Complexity:** Medium (3–4 engineering days).
- **Testing Requirements:**
  - Unit tests with mock responses verifying JSON parsing.
  - Integration tests against live providers (guarded by `pytest.mark.skipif(not os.getenv("OPENAI_API_KEY"))`).
  - Error recovery test verifying fallback to heuristic scoring if live API times out.

---

### A.2 Real Speech-to-Text (STT) & Audio Processing Provider

#### Purpose & Goal
Replace client-side `Math.random()` pace simulation and static STT stubs with genuine speech-to-text audio ingestion and millisecond-accurate timestamp word tokenization.

#### Concrete Implementation Architecture
```
[Browser Web Audio API]
  │ (Blob: audio/webm; codecs=opus)
  ▼
[Backend MediaController / Upload API]
  │
  ▼
[Python AI Service: /api/v1/ai/transcribe-audio]
  │
  ├─► Option 1: OpenAI Whisper API (POST /v1/audio/transcriptions)
  ├─► Option 2: Deepgram Nova-2 Streaming API (WSS / REST)
  └─► Option 3: Local faster-whisper ONNX / GPU (Zero API cost)
  │
  ▼
[SpeakingCoachService: Real WPM, Pauses, Fillers]
```

#### Detailed Item Specifications
- **Files to Modify / Create:**
  - `ai-service/app/providers/whisper_provider.py`: Whisper API client and local `faster-whisper` option.
  - `ai-service/app/providers/deepgram_provider.py`: Deepgram REST / WebSocket transcription client.
  - `ai-service/app/api/endpoints/ai_routes.py`: Add `/api/v1/ai/transcribe-audio` accepting `UploadFile`.
  - `backend/src/main/java/com/interviewos/media/service/SpeechService.java`: Call Python AI transcription endpoint with audio stream.
  - `frontend/src/pages/app/SpeakingCoachPage.tsx`: Implement real browser microphone capture via `navigator.mediaDevices.getUserMedia()` + `MediaRecorder` API. Remove `Math.random()` timer and hardcoded simulation buttons.
- **External APIs Required:**
  - OpenAI Whisper API (`https://api.openai.com/v1/audio/transcriptions`) OR Deepgram Nova-2 (`https://api.deepgram.com/v1/listen`).
- **Environment Variables:**
  - `STT_PROVIDER`: `whisper` | `deepgram` | `faster-whisper-local` | `mock`
  - `DEEPGRAM_API_KEY`: Secret Deepgram API key.
- **Database Changes:** None. `speech_metrics` table in `V4__init_media_and_speech.sql` already has `words_per_minute`, `filler_word_count`, `filler_breakdown`, `clarity_score`, and `pace_status`.
- **Security Concerns:**
  - Audio uploads must be validated for MIME type (`audio/webm`, `audio/mp4`, `audio/wav`), file size ($< 25\text{MB}$), and magic bytes.
  - Microphone access in browser must handle permission denial gracefully.
- **Implementation Complexity:** High (4–5 engineering days).
- **Testing Requirements:**
  - Upload real `.wav` and `.webm` sample audio clips and verify accurate transcription string and filler count.
  - Test browser permission grant, revoke, and error states.

---

### A.3 Executive 4-Persona AI Panel Orchestrator & Frontend Fix

#### Purpose & Goal
Fix the frontend UUID bug causing silent fallback to mock panel turns, remove hardcoded dialogue strings from `PanelService.java`, and drive the 4-persona panel through LLM multi-agent system prompts.

#### Concrete Implementation Architecture
1. **Fix Frontend Bug in `AIPanelPage.tsx`:**
   - Replace `api.panel.getSession("panel-session-1")` with a flow that creates or retrieves a genuine `InterviewSession` UUID.
2. **Implement LLM Persona Orchestration in `ai-service`:**
   - Define system prompts for each of the 4 executive personas:
     - **Priya Sharma (HR / Talent):** Explores behavioral STAR examples, team dynamics, work ethics, and leadership philosophy.
     - **Alex Chen (Tech Lead):** Inquisitive, rigorous. Probes concurrency, memory model, lock contention, and clean architectural design.
     - **Dr. Elena Rostova (Chief Architect):** Demanding. Issues architectural challenges on distributed consistency, CAP trade-offs, network partitions, and failover.
     - **Marcus Vance (VP of Engineering):** Focuses on business delivery, timeline negotiation, technical debt trade-offs, and pragmatic engineering execution.
3. **Backend Integration:**
   - In `backend/src/main/java/com/interviewos/panel/service/PanelService.java`, replace the hardcoded switch with an HTTP call to `ai-service/api/v1/ai/panel-turn`.

#### Detailed Item Specifications
- **Files to Modify:**
  - `frontend/src/pages/app/AIPanelPage.tsx`: Fetch current candidate's active panel session ID dynamically or generate a new session via `api.interviews.create({ interviewType: 'PANEL' })`.
  - `backend/src/main/java/com/interviewos/panel/service/PanelService.java`: Remove hardcoded string constants; invoke `AiServiceClient.generatePanelTurn(request)`.
  - `ai-service/app/services/panel_orchestrator.py`: Replace static turn logic with multi-agent prompt construction feeding into `BaseLLMProvider`.
- **Environment Variables:** Handled by Phase A.1 (`AI_PROVIDER`).
- **Database Changes:** None. Relational schema in `panel_sessions` and `panel_turns` is already normalized and supports dynamic persona IDs and turn texts.
- **Security Concerns:** Restrict panel turn submission to the authenticated candidate who owns the session.
- **Implementation Complexity:** Medium (3 engineering days).
- **Testing Requirements:**
  - Verify full 8-turn panel session end-to-end: Priya $\to$ Alex $\to$ Elena $\to$ Marcus $\to$ Priya.
  - Verify each turn reflects the candidate's previous response rather than canned text.

---

## Phase B: Data & Market Intelligence Engine

### B.1 Live Job Market Search & Postings Integration

#### Purpose & Goal
Replace static Stripe/Netflix sample records in `JobService.java` with live job feeds from verified employment aggregators, with caching and salary normalization.

#### Recommended Providers
1. **Adzuna API (`https://api.adzuna.com/v1/api/jobs/`)**: Free tier provides 250 requests/day with structured salaries, locations, and descriptions.
2. **JSearch via RapidAPI (`https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch`)**: Real-time aggregated jobs from LinkedIn, Indeed, Glassdoor, and ZipRecruiter with rich filter parameters.
3. **USAJobs API**: For verified public-sector engineering roles.

#### Implementation Architecture
```
[Frontend JobSearchPage]
         │
         ▼
[Backend JobController / JobService]
         │
         ├─► Query Local PostgreSQL (job_postings)
         │       └─ If stale or empty:
         ├─► Fetch Live External Provider (Adzuna / JSearch)
         │       └─ Apply Redis Cache (TTL: 6 hours)
         ▼
[Save Normalized Postings to PostgreSQL & Return Paged Results]
```

#### Detailed Item Specifications
- **Files to Modify / Create:**
  - `backend/src/main/java/com/interviewos/job/client/ExternalJobClient.java`: Spring `RestClient` integration for Adzuna / JSearch.
  - `backend/src/main/java/com/interviewos/job/service/JobService.java`: Query external client when search term or filter is specified; remove `seedSampleJobsIfEmpty()`.
  - `backend/src/main/resources/application.yml`: Configure job provider URL and API keys.
- **Environment Variables:**
  - `JOB_PROVIDER`: `adzuna` | `jsearch` | `database`
  - `ADZUNA_APP_ID`: Application ID
  - `ADZUNA_API_KEY`: API Key
  - `RAPIDAPI_KEY`: JSearch RapidAPI Key (if using JSearch)
- **Database Changes:** Add `external_provider` and `external_job_id` columns to `job_postings` with unique index to prevent duplicate ingestion.
- **Security Concerns:**
  - External job HTML descriptions must be sanitized using OWASP HTML Sanitizer before serving to frontend to prevent stored XSS.
- **Implementation Complexity:** Medium (3 engineering days).
- **Testing Requirements:**
  - Test query with "Staff Backend Java" and verify 10+ live postings returned with valid URLs.
  - Test cache hit behavior to verify external API rate limit preservation.

---

### B.2 Sourced Salary Intelligence & Public Disclosures

#### Purpose & Goal
Replace static median fallback values and fixed Python multipliers with verified salary distribution percentiles sourced from official public disclosures and tech compensation datasets.

#### Recommended Datasets & Providers
1. **U.S. Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OEWS)**: Official government data for SOC codes 15-1252 (Software Developers) and 15-1254 (Web Developers).
2. **Public U.S. DOL Foreign Labor Certification (H-1B / PERM) Disclosure Dataset**: Exact base salaries filed with the Department of Labor by Google, Meta, Stripe, Amazon, Apple, etc.
3. **Levels.fyi Aggregate Data Feed / RapidAPI Salary Insights**.

#### Implementation Architecture
- Load pre-aggregated BLS and DOL wage percentiles ($10^{\text{th}}$, $25^{\text{th}}$, $50^{\text{th}}$, $75^{\text{th}}$, $90^{\text{th}}$) into `salary_observations` PostgreSQL table across 15 tech hubs (SF Bay Area, NYC, Seattle, Austin, Remote, etc.).
- `SalaryService.java` queries real percentiles matching job family, seniority, and geographic location.

#### Detailed Item Specifications
- **Files to Modify:**
  - `backend/src/main/resources/db/migration/V9__seed_verified_bls_salary_data.sql`: Create migration seeding 200+ verified compensation benchmarks from official 2025/2026 BLS OEWS and DOL data.
  - `backend/src/main/java/com/interviewos/salary/service/SalaryService.java`: Remove hardcoded fallback; return genuine percentiles with sample size and official citation.
  - `ai-service/app/services/salary_estimator.py`: Use logarithmic regression trained on BLS/DOL bands rather than static $185k multiplier.
- **Implementation Complexity:** Low-Medium (2 engineering days).
- **Testing Requirements:**
  - Query Senior Backend in San Francisco $\to$ assert median $> \$190,000$.
  - Query Entry Frontend in Remote $\to$ assert median $> \$95,000$.

---

### B.3 Production Feature Flag & Disablement of Seed Fixtures

#### Purpose & Goal
Prevent automatic seeding of dummy applications, fake jobs, or canned weaknesses when running in production mode.

#### Implementation Architecture
- Add `DEMO_MODE=false` environment variable.
- In `JobService.java`, `SalaryService.java`, and `LearningService.java`, wrap all `seedSample*` methods in:
  ```java
  @Value("${app.demo-mode:false}")
  private boolean demoMode;

  if (demoMode && list.isEmpty()) { ... }
  ```
- In frontend `frontend/src/services/api.ts`, remove silent catch-block mock returns or disable them when `import.meta.env.VITE_DEMO_MODE !== "true"`. This ensures real backend errors bubble up to UI toast notifications.

---

## Phase C: Execution Sandbox & Media Infrastructure

### C.1 Secure In-Browser Technical Coding Lab Sandbox

#### Purpose & Goal
Replace client-side `setTimeout(..., 800)` mock in `CodingLabPage.tsx` with a secure, isolated remote execution engine that executes untrusted candidate code against real unit tests in Java and Python.

#### Recommended Architectures
1. **Self-Hosted Judge0 / Piston Engine (Recommended for production)**:
   - High-performance, multi-language sandbox with memory limits, CPU quotas, and process isolation via Linux `cgroups` and `seccomp`.
2. **Client-Side WebAssembly Runner (Pyodide / CheerpJ)**:
   - Zero server cost; executes Python in WebAssembly directly in the user's browser. (CheerpJ for Java).
3. **Backend Worker with gVisor / Docker-in-Worker**:
   - Container worker executing `javac` / `python -m unittest` inside ephemeral gVisor sandboxes.

#### Detailed Item Specifications
- **Files to Modify / Create:**
  - `backend/src/main/java/com/interviewos/learning/controller/CodingExecutionController.java`: Endpoint `POST /api/v1/learning/challenges/{id}/execute`.
  - `backend/src/main/java/com/interviewos/learning/service/CodeExecutionService.java`: REST client invoking Judge0 / Piston API with timeout (2000ms) and memory cap (256MB).
  - `frontend/src/pages/app/CodingLabPage.tsx`: Call `api.coding.execute(challengeId, code)` and render live stdout, stderr, execution time, and test pass/fail results.
- **Environment Variables:**
  - `CODE_EXECUTION_ENGINE`: `judge0` | `piston` | `mock`
  - `JUDGE0_API_URL`: e.g. `http://localhost:2358` or RapidAPI endpoint
  - `JUDGE0_API_KEY`: Secret API key (if using hosted Judge0)
- **Security Concerns:**
  - Sandboxed execution must disable network access, block filesystem writes outside `/tmp`, restrict fork bombs (`pids.max=32`), and kill execution after 2.5 seconds.
- **Implementation Complexity:** High (4–5 engineering days).
- **Testing Requirements:**
  - Submit working LRU Cache $\to$ assert 8/8 tests pass.
  - Submit infinite loop `while(true){}` $\to$ assert Time Limit Exceeded (TLE) returned within 3000ms without crashing backend.
  - Submit malicious code `System.exit(0)` or `Runtime.getRuntime().exec(...)` $\to$ assert security violation trapped.

---

### C.2 Production Cloud Object Storage (S3 / R2 / GCS)

#### Purpose & Goal
Transition resume documents and interview audio/video recordings from local filesystem `./storage/` to cloud object storage using presigned direct-upload URLs.

#### Detailed Item Specifications
- **Files to Modify:**
  - `backend/src/main/java/com/interviewos/common/storage/S3FileStorageService.java`: Implement `FileStorageService` using AWS SDK v2 (`software.amazon.awssdk:s3`).
  - Configure `application.yml` storage provider conditional bean:
    `@ConditionalOnProperty(name = "storage.provider", havingValue = "S3")`.
- **Environment Variables:**
  - `STORAGE_PROVIDER`: `S3` (or `LOCAL` for dev)
  - `AWS_ACCESS_KEY_ID`: S3 credentials
  - `AWS_SECRET_ACCESS_KEY`: S3 credentials
  - `AWS_REGION`: e.g. `us-east-1`
  - `AWS_S3_BUCKET`: `interviewos-production-media`
- **Security Concerns:**
  - Use presigned PUT URLs with 15-minute expiration so client uploads directly to S3 without saturating backend bandwidth.
  - S3 bucket must have Block Public Access enabled; candidate files served only through presigned GET URLs with authentication checks.
- **Implementation Complexity:** Medium (2 engineering days).

---

## 4. Master Implementation Sequence & Priority

| Priority | Item | Phase | Business Impact | Estimated Effort |
|:---:|---|:---:|---|:---:|
| **P0** | Multi-Provider LLM Engine (OpenAI / Anthropic / Gemini / Mock) | Phase A | Unlocks genuine resume critique, dynamic interview questions, and real scoring | 3 days |
| **P0** | Fix Frontend AI Panel UUID Bug & Wire LLM Personas | Phase A | Fixes broken core feature and enables real 4-persona executive panel | 2 days |
| **P1** | Speech-to-Text (Whisper / Deepgram) Integration | Phase A | Converts Speaking Coach from fake timer to real vocal analysis | 3 days |
| **P1** | Add `DEMO_MODE=false` Flag & Harden Frontend Catch Blocks | Phase B | Eliminates deceptive demo fixtures from production runtime | 1 day |
| **P2** | Live Job Search Integration (Adzuna / JSearch) | Phase B | Connects users to genuine hiring opportunities | 3 days |
| **P2** | Sourced Salary Intelligence (BLS / DOL Dataset Migration) | Phase B | Provides verified, legally compliant salary benchmarks | 2 days |
| **P3** | Remote Code Execution Sandbox (Judge0 / Piston) | Phase C | Makes Coding Lab functional with real test verification | 4 days |
| **P3** | S3 Cloud Object Storage for Media & Resumes | Phase C | Production durability and scalability for large audio/video files | 2 days |

---

## 5. Verification & Quality Gates

Each milestone must pass the following non-negotiable verification gates:
1. **Automated Test Integrity:** Unit and integration test suites pass (`mvn test`, `pytest`, `npm test`).
2. **Provider Transparency:** The system explicitly reports which provider served each request (`x-ai-provider: openai-gpt-4o-mini`, etc.).
3. **Graceful Degradation:** If an external provider experiences an outage (503/timeout), the system falls back safely without unhandled 500 errors.
4. **Zero Dark Mode & Light Theme Integrity:** All new UI components remain strictly light-theme compliant per platform guidelines.
