-- V7__seed_development_fixtures.sql
-- InterviewOS Schema: Baseline Roles, Permissions, AI Personas, Taxonomies, and Clearly Labeled Demo Fixtures

-- Standard Roles
INSERT INTO roles (id, name, description, is_system) VALUES
('ROLE_CANDIDATE', 'Candidate', 'Access to candidate preparation, mock interviews, and roadmaps', TRUE),
('ROLE_RECRUITER', 'Recruiter', 'Access to recruiter workspace, candidate management, and evaluations', TRUE),
('ROLE_HIRING_MGR', 'Hiring Manager', 'Access to candidate reviews, team scorecards, and stage approvals', TRUE),
('ROLE_ORG_ADMIN', 'Organization Administrator', 'Administers organization users, settings, and job requisitions', TRUE),
('ROLE_ADMIN', 'Platform Administrator', 'Full platform operational administration and system health access', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Standard Permissions
INSERT INTO permissions (id, category, name, description) VALUES
('interview:create', 'INTERVIEWS', 'Create Mock Interview', 'Allows launching AI mock interviews'),
('interview:view', 'INTERVIEWS', 'View Interview Reports', 'Allows viewing personal interview feedback'),
('resume:upload', 'RESUMES', 'Upload & Analyze Resume', 'Allows parsing and scoring resumes'),
('recruiter:manage_jobs', 'RECRUITER', 'Manage Requisitions', 'Allows creating and editing recruiter job postings'),
('recruiter:view_candidates', 'RECRUITER', 'View Candidates', 'Allows viewing candidate scorecards and notes'),
('admin:system_health', 'ADMIN', 'System Health', 'Allows monitoring system services and AI providers')
ON CONFLICT (id) DO NOTHING;

-- Map permissions to roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
('ROLE_CANDIDATE', 'interview:create'),
('ROLE_CANDIDATE', 'interview:view'),
('ROLE_CANDIDATE', 'resume:upload'),
('ROLE_RECRUITER', 'recruiter:manage_jobs'),
('ROLE_RECRUITER', 'recruiter:view_candidates'),
('ROLE_ADMIN', 'admin:system_health')
ON CONFLICT DO NOTHING;

-- AI Panel Personas (Signature 4-Persona Interview Panel)
INSERT INTO panel_personas (id, display_name, role_title, avatar_url, focus_areas, questioning_style, evaluation_criteria, is_active) VALUES
(
    'HR',
    'Priya Sharma',
    'Director of Talent & Culture',
    '/avatars/persona-priya.png',
    ARRAY['Job Motivation', 'Behavioral STAR Examples', 'Conflict Resolution', 'Team Collaboration', 'Work Ethic'],
    'Warm yet incisive. Focuses on specific interpersonal scenarios and emotional intelligence.',
    ARRAY['Communication Clarity', 'Empathy & Teamwork', 'Cultural Alignment', 'Adaptability'],
    TRUE
),
(
    'TECH_LEAD',
    'Alex Chen',
    'Principal Software Engineer',
    '/avatars/persona-alex.png',
    ARRAY['Technical Correctness', 'Concurrency & Memory', 'Data Structures & Algorithms', 'Debugging', 'Code Quality'],
    'Analytical, direct, and rigorous. Drills into technical trade-offs and code implementation details.',
    ARRAY['Technical Depth', 'Algorithmic Soundness', 'Debugging Acumen', 'Best Practices'],
    TRUE
),
(
    'HIRING_MGR',
    'Marcus Vance',
    'VP of Engineering',
    '/avatars/persona-marcus.png',
    ARRAY['Ownership & Delivery', 'Prioritization', 'Cross-Functional Collaboration', 'Business Impact'],
    'Strategic, pragmatic, and outcome-oriented. Challenges candidates on past delivery bottlenecks and accountability.',
    ARRAY['Ownership', 'Pragmatism', 'Strategic Thinking', 'Stakeholder Management'],
    TRUE
),
(
    'ARCHITECT',
    'Dr. Elena Rostova',
    'Chief Enterprise Architect',
    '/avatars/persona-elena.png',
    ARRAY['Distributed Systems', 'Scalability & Resilience', 'CAP Theorem', 'Fault Tolerance', 'Security'],
    'Inquisitive, visionary, and demanding on trade-offs. Explores system bottlenecks and failure modes under extreme scale.',
    ARRAY['Architectural Vision', 'Scalability Trade-Offs', 'Failure Mode Analysis', 'Maintainability'],
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    role_title = EXCLUDED.role_title,
    focus_areas = EXCLUDED.focus_areas,
    questioning_style = EXCLUDED.questioning_style,
    evaluation_criteria = EXCLUDED.evaluation_criteria;

-- Skill Taxonomy
INSERT INTO skill_taxonomy (id, name, category, job_family, description, difficulty) VALUES
('java.core', 'Java Core & Collections', 'LANGUAGE', 'BACKEND', 'Java Memory Model, JVM internals, Collections framework', 'MEDIUM'),
('java.concurrency', 'Java Concurrency & Multithreading', 'LANGUAGE', 'BACKEND', 'Threads, Executors, Synchronizers, CompletableFuture, Lock-free constructs', 'HARD'),
('spring.boot', 'Spring Boot & Spring Framework', 'FRAMEWORK', 'BACKEND', 'IoC, DI, Spring Data, Transactions, AOP, Spring Security', 'MEDIUM'),
('dotnet.core', 'C# & ASP.NET Core', 'FRAMEWORK', 'BACKEND', 'Async/await, LINQ, Entity Framework Core, Middleware, Dependency Injection', 'MEDIUM'),
('react.core', 'React 19 & State Architecture', 'FRAMEWORK', 'FRONTEND', 'Hooks, Server Components, Fiber reconciler, Concurrent rendering, TanStack', 'MEDIUM'),
('typescript.adv', 'Advanced TypeScript', 'LANGUAGE', 'FRONTEND', 'Generics, Conditional Types, Template Literal Types, Utility types', 'MEDIUM'),
('system.distributed', 'Distributed Systems & Microservices', 'ARCHITECTURE', 'BACKEND', 'Event-driven architectures, Kafka, idempotency, consensus, saga pattern', 'HARD'),
('system.caching', 'Caching & Performance Optimization', 'ARCHITECTURE', 'BACKEND', 'Redis, Cache-aside, Write-through, Invalidation strategies, CDNs', 'MEDIUM'),
('sql.indexing', 'SQL Optimization & Indexing', 'DATABASE', 'DATABASE', 'B-trees, execution plans, joins, ACID properties, isolation levels', 'MEDIUM'),
('qa.automation', 'QA Test Automation & Playwright', 'FRAMEWORK', 'QA', 'E2E testing, visual regression, CI test pipelines, test pyramids', 'MEDIUM')
ON CONFLICT (id) DO NOTHING;

-- Standard Coding Challenges
INSERT INTO coding_challenges (id, title, slug, difficulty, category, description, starter_code, test_cases, time_limit_ms, memory_limit_mb, is_active) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'LRU Cache Implementation',
    'lru-cache-implementation',
    'MEDIUM',
    'DATA_STRUCTURES',
    'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.',
    '{"java": "class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n    }\n}", "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass"}',
    '[{"input": "put(1,1), put(2,2), get(1)", "expected": "1"}, {"input": "put(3,3), get(2)", "expected": "-1"}]',
    2000,
    256,
    TRUE
),
(
    '00000000-0000-0000-0000-000000000002',
    'Concurrent Rate Limiter (Token Bucket)',
    'concurrent-rate-limiter-token-bucket',
    'HARD',
    'CONCURRENCY',
    'Implement a thread-safe token bucket rate limiter allowing a burst capacity and continuous refill rate.',
    '{"java": "public class TokenBucketRateLimiter {\n    public TokenBucketRateLimiter(int maxTokens, double refillRatePerSecond) {\n    }\n    \n    public synchronized boolean tryAcquire() {\n        return false;\n    }\n}", "python": "class TokenBucketRateLimiter:\n    def __init__(self, max_tokens: int, refill_rate_per_sec: float):\n        pass\n    def try_acquire(self) -> bool:\n        return False"}',
    '[{"input": "acquire burst", "expected": "true"}, {"input": "exceed capacity", "expected": "false"}]',
    2000,
    256,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Clearly Labeled Demo Organizations
INSERT INTO organizations (id, name, slug, website, industry, company_size, is_verified, is_active) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Acme Cloud Technologies [DEMO FIXTURE]',
    'acme-cloud-demo',
    'https://acme-cloud.example.com',
    'Enterprise Software / Cloud Computing',
    '500-1000 employees',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Clearly Labeled Demo Users (Password: Password123! - BCrypt hash)
-- BCrypt: $2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee
INSERT INTO users (id, email, password_hash, first_name, last_name, is_active, is_email_verified) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'candidate@interviewos.dev',
    '$2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee',
    'David [DEMO]',
    'Candidate',
    TRUE,
    TRUE
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'recruiter@interviewos.dev',
    '$2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee',
    'Sarah [DEMO]',
    'Recruiter',
    TRUE,
    TRUE
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'admin@interviewos.dev',
    '$2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee',
    'System [DEMO]',
    'Admin',
    TRUE,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- User Roles Mapping
INSERT INTO user_roles (user_id, role_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ROLE_CANDIDATE'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ROLE_RECRUITER'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'ROLE_ADMIN')
ON CONFLICT DO NOTHING;

-- Demo User Profiles
INSERT INTO user_profiles (user_id, headline, target_role, experience_level, location, primary_skills, target_companies) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Senior Full-Stack & Distributed Systems Engineer [DEMO FIXTURE]',
    'Senior Backend Engineer',
    'SENIOR',
    'San Francisco, CA / Remote',
    ARRAY['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Distributed Systems'],
    ARRAY['Google', 'Stripe', 'Netflix', 'Amazon']
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Lead Technical Talent Partner [DEMO FIXTURE]',
    'Technical Recruiter',
    'LEAD',
    'New York, NY',
    ARRAY['Engineering Hiring', 'Talent Acquisition', 'Technical Screening'],
    ARRAY['Acme Cloud Technologies']
)
ON CONFLICT (user_id) DO NOTHING;

-- Demo User Settings
INSERT INTO user_settings (user_id, theme, speaking_coach_live, language_locale) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'light', TRUE, 'en-US'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'light', TRUE, 'en-US'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'light', TRUE, 'en-US')
ON CONFLICT (user_id) DO NOTHING;

-- Demo Recruiter Membership
INSERT INTO organization_memberships (organization_id, user_id, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE)
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- Demo Recruiter Job
INSERT INTO recruiter_jobs (id, organization_id, created_by_user_id, title, department, job_family, seniority, location, description, required_skills, status) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Senior Distributed Systems Engineer (Java/Spring) [DEMO FIXTURE]',
    'Core Infrastructure',
    'BACKEND',
    'SENIOR',
    'Remote / Hybrid',
    'We are seeking a seasoned Backend Engineer experienced in building fault-tolerant, high-throughput microservices using Java 21, Spring Boot, Kafka, and PostgreSQL. You will design distributed transactions and optimize database performance under heavy loads.',
    ARRAY['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Distributed Systems', 'Docker'],
    'PUBLISHED'
)
ON CONFLICT (id) DO NOTHING;

-- Feature Flags
INSERT INTO feature_flags (flag_key, description, is_enabled) VALUES
('ai_panel_simulation', 'Enables 4-person multi-role AI mock panel', TRUE),
('live_speech_coaching', 'Enables real-time filler word and pace HUD', TRUE),
('coding_sandbox', 'Enables in-browser code editor and static analysis', TRUE),
('salary_benchmark_engine', 'Enables statistical compensation intelligence', TRUE)
ON CONFLICT (flag_key) DO NOTHING;
