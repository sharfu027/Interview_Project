-- V5__init_improvement_and_salary.sql
-- InterviewOS Schema: Skills, Weaknesses, Career Roadmaps, Practice Activities, Coding Lab, and Salary Intelligence

-- Skill Taxonomy
CREATE TABLE IF NOT EXISTS skill_taxonomy (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'java.concurrency', 'spring.boot', 'system.caching'
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- LANGUAGE, FRAMEWORK, ARCHITECTURE, DATABASE, CLOUD, SOFT_SKILL
    job_family VARCHAR(50) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM'
);

-- Candidate Skills
CREATE TABLE IF NOT EXISTS candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id VARCHAR(100) NOT NULL REFERENCES skill_taxonomy(id) ON DELETE CASCADE,
    proficiency_level NUMERIC(4,2) NOT NULL DEFAULT 5.0, -- 1.0 to 10.0
    confidence_score NUMERIC(4,2) NOT NULL DEFAULT 0.5,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_user ON candidate_skills(user_id);

-- Identified Weaknesses (Longitudinal improvement engine)
CREATE TABLE IF NOT EXISTS identified_weaknesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency VARCHAR(100) NOT NULL,
    skill_id VARCHAR(100) REFERENCES skill_taxonomy(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    confidence_level NUMERIC(4,2) NOT NULL DEFAULT 0.8,
    explanation TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IDENTIFIED', -- IDENTIFIED, IN_PROGRESS, RESOLVED, VERIFIED
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weaknesses_user ON identified_weaknesses(user_id);

-- Weakness Evidence (Traceable to specific session and question)
CREATE TABLE IF NOT EXISTS weakness_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weakness_id UUID NOT NULL REFERENCES identified_weaknesses(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
    answer_excerpt TEXT,
    evaluator_comment TEXT NOT NULL,
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weakness_evidence_weakness ON weakness_evidence(weakness_id);

-- Career Roadmaps
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    target_seniority VARCHAR(50) NOT NULL DEFAULT 'SENIOR',
    target_completion_date DATE,
    weekly_study_hours INT NOT NULL DEFAULT 10,
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, COMPLETED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON career_roadmaps(user_id);

-- Roadmap Milestones
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES career_roadmaps(id) ON DELETE CASCADE,
    milestone_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skill_category VARCHAR(100) NOT NULL,
    estimated_hours INT NOT NULL DEFAULT 15,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    learning_resources JSONB DEFAULT '[]',
    practice_prompts TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_roadmap ON roadmap_milestones(roadmap_id);

-- Practice Activities
CREATE TABLE IF NOT EXISTS practice_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- DAILY_CHALLENGE, FLASH_QUESTION, REPLAY_ANSWER, CODING_LAB
    title VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    user_response TEXT,
    ai_score NUMERIC(4,2),
    ai_feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Coding Challenges
CREATE TABLE IF NOT EXISTS coding_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    category VARCHAR(100) NOT NULL, -- DATA_STRUCTURES, ALGORITHMS, CONCURRENCY, DATABASE
    description TEXT NOT NULL,
    starter_code JSONB NOT NULL DEFAULT '{}', -- e.g. {"java": "...", "python": "...", "javascript": "..."}
    test_cases JSONB NOT NULL DEFAULT '[]', -- visible and hidden test cases
    time_limit_ms INT NOT NULL DEFAULT 2000,
    memory_limit_mb INT NOT NULL DEFAULT 256,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Coding Submissions
CREATE TABLE IF NOT EXISTS coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES coding_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED', -- ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR
    passed_tests INT NOT NULL DEFAULT 0,
    total_tests INT NOT NULL DEFAULT 0,
    execution_time_ms INT DEFAULT 0,
    ai_code_review TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON coding_submissions(user_id);

-- Salary Intelligence: Sources & Observations
CREATE TABLE IF NOT EXISTS salary_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    data_provider VARCHAR(100) NOT NULL,
    reliability_rating NUMERIC(3,2) DEFAULT 0.90,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salary_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES salary_sources(id) ON DELETE SET NULL,
    job_family VARCHAR(100) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    seniority VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    base_salary_min NUMERIC(12,2) NOT NULL,
    base_salary_median NUMERIC(12,2) NOT NULL,
    base_salary_max NUMERIC(12,2) NOT NULL,
    total_comp_median NUMERIC(12,2),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    sample_size INT DEFAULT 1,
    observation_year INT NOT NULL DEFAULT 2026,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_salary_obs_role_loc ON salary_observations(job_family, seniority, location);

-- Salary Negotiation Sessions (Candidate simulation)
CREATE TABLE IF NOT EXISTS salary_negotiation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(100) NOT NULL,
    target_company VARCHAR(255) NOT NULL,
    initial_offer NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    counter_offer NUMERIC(12,2),
    outcome_status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    negotiation_log JSONB DEFAULT '[]',
    ai_negotiation_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Saved Question Bank
CREATE TABLE IF NOT EXISTS saved_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    reference_answer TEXT,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_questions_user ON saved_questions(user_id);
