-- V6__init_recruiter_and_platform_operations.sql
-- InterviewOS Schema: Recruiter Workflows, Scorecards, Subscriptions, Usage, and Notifications

-- Recruiter Jobs (Tenant-scoped Job requisitions)
CREATE TABLE IF NOT EXISTS recruiter_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    job_family VARCHAR(100) NOT NULL,
    seniority VARCHAR(50) NOT NULL DEFAULT 'MID',
    location VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'FULL_TIME',
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, PAUSED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_org ON recruiter_jobs(organization_id);

-- Interview Stage Definitions
CREATE TABLE IF NOT EXISTS interview_stage_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_id UUID REFERENCES recruiter_jobs(id) ON DELETE CASCADE,
    stage_order INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL, -- SCREENING, TECHNICAL_ROUND_1, SYSTEM_DESIGN, CULTURE_FIT, EXECUTIVE
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter Candidate Links (Applications into recruiter workflow with privacy controls)
CREATE TABLE IF NOT EXISTS recruiter_candidate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES recruiter_jobs(id) ON DELETE CASCADE,
    candidate_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_stage_id UUID REFERENCES interview_stage_definitions(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, HIRED, REJECTED, WITHDRAWN
    candidate_consented_share BOOLEAN NOT NULL DEFAULT FALSE,
    recruiter_rating NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, candidate_user_id)
);

CREATE INDEX IF NOT EXISTS idx_recruiter_cand_links_org ON recruiter_candidate_links(organization_id);

-- Recruiter Notes
CREATE TABLE IF NOT EXISTS recruiter_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_link_id UUID NOT NULL REFERENCES recruiter_candidate_links(id) ON DELETE CASCADE,
    author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note_text TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Evaluation Scorecards
CREATE TABLE IF NOT EXISTS evaluation_scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_link_id UUID NOT NULL REFERENCES recruiter_candidate_links(id) ON DELETE CASCADE,
    interviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    stage_id UUID REFERENCES interview_stage_definitions(id) ON DELETE SET NULL,
    recommendation VARCHAR(50) NOT NULL, -- STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE
    overall_score NUMERIC(4,2) NOT NULL,
    competency_scores JSONB NOT NULL DEFAULT '{}', -- e.g. {"system_architecture": 9, "communication": 8}
    strengths TEXT[] DEFAULT '{}',
    areas_for_improvement TEXT[] DEFAULT '{}',
    general_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scorecards_candidate ON evaluation_scorecards(candidate_link_id);

-- Subscriptions and Plans
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE', -- FREE, PRO_CANDIDATE, RECRUITER_STARTER, ENTERPRISE
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, CANCELLED, TRIALING
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Usage Records (Meters for AI Tokens, Transcription, and Storage)
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    meter_name VARCHAR(100) NOT NULL, -- AI_PROMPT_TOKENS, AI_COMPLETION_TOKENS, TRANSCRIPTION_SECONDS, VIDEO_STORAGE_MB, MOCK_INTERVIEWS_RUN
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_records_user ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_meter ON usage_records(meter_name);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- INTERVIEW_READY, ROADMAP_REMINDER, SYSTEM_ALERT, SCORECARD_READY
    reference_link VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    flag_key VARCHAR(100) PRIMARY KEY,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    target_audiences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
