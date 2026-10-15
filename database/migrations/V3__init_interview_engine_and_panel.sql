-- V3__init_interview_engine_and_panel.sql
-- InterviewOS Schema: Interview Session Engine, Questions, Answers, Rubrics, and AI Panel

-- Interview Templates
CREATE TABLE IF NOT EXISTS interview_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    interview_type VARCHAR(50) NOT NULL, -- HR, TECHNICAL, SYSTEM_DESIGN, CODING, BEHAVIORAL, RESUME_GRILLING, ARCHITECT, MANAGER
    job_family VARCHAR(100) NOT NULL,
    seniority VARCHAR(50) NOT NULL DEFAULT 'MID',
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD, EXPERT
    duration_minutes INT NOT NULL DEFAULT 45,
    question_count INT NOT NULL DEFAULT 5,
    rubric_guidelines JSONB,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Interview Prompt Versions (Auditability & Reproducibility)
CREATE TABLE IF NOT EXISTS interview_prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(100) NOT NULL,
    version_tag VARCHAR(50) NOT NULL UNIQUE,
    prompt_template TEXT NOT NULL,
    model_identifier VARCHAR(100) NOT NULL,
    temperature NUMERIC(3,2) DEFAULT 0.2,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Interview Sessions (State Machine)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    job_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
    template_id UUID REFERENCES interview_templates(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    job_family VARCHAR(100) NOT NULL,
    seniority VARCHAR(50) NOT NULL DEFAULT 'MID',
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    mode VARCHAR(50) NOT NULL DEFAULT 'AUDIO_VIDEO', -- TEXT, AUDIO, AUDIO_VIDEO, CODING
    is_strict_simulation BOOLEAN NOT NULL DEFAULT FALSE,
    feedback_timing VARCHAR(50) NOT NULL DEFAULT 'AFTER_SESSION', -- REAL_TIME, AFTER_QUESTION, AFTER_SESSION
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED', -- CREATED, READY, IN_PROGRESS, AWAITING_ANSWER, PROCESSING_ANSWER, AWAITING_FOLLOWUP, PAUSED, COMPLETED, CANCELLED, FAILED
    current_question_index INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 5,
    duration_minutes INT NOT NULL DEFAULT 45,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    overall_score NUMERIC(5,2),
    summary_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON interview_sessions(status);

-- Interview Session Events (Audit & Replay timeline)
CREATE TABLE IF NOT EXISTS interview_session_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_events_session ON interview_session_events(session_id);

-- Interview Questions
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    interviewer_persona VARCHAR(100) NOT NULL DEFAULT 'Technical Lead',
    competency VARCHAR(100) NOT NULL, -- e.g. CONCURRENCY, SYSTEM_DESIGN, STAR_TEAMWORK
    question_text TEXT NOT NULL,
    expected_concepts TEXT[] DEFAULT '{}',
    rubric_guidelines TEXT,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    source_reference TEXT, -- e.g. 'Project: E-Commerce Microservices in Resume v1'
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACTIVE, ANSWERED, SKIPPED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (session_id, question_order)
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_session ON interview_questions(session_id);

-- Interview Answers
CREATE TABLE IF NOT EXISTS interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    answer_duration_seconds INT DEFAULT 0,
    wpm NUMERIC(5,1) DEFAULT 0,
    filler_word_count INT DEFAULT 0,
    pause_count INT DEFAULT 0,
    audio_asset_url VARCHAR(500),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_answers_question ON interview_answers(question_id);

-- Interview Rubrics and Scores
CREATE TABLE IF NOT EXISTS interview_rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    criterion VARCHAR(100) NOT NULL,
    max_score INT NOT NULL DEFAULT 10,
    weight NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    description TEXT
);

CREATE TABLE IF NOT EXISTS interview_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES interview_answers(id) ON DELETE CASCADE,
    criterion VARCHAR(100) NOT NULL, -- TECHNICAL_CORRECTNESS, REASONING, COMPLETENESS, CLARITY, TRADE_OFFS
    score NUMERIC(4,2) NOT NULL,
    max_score NUMERIC(4,2) NOT NULL DEFAULT 10.0,
    evaluator_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interview_scores_answer ON interview_scores(answer_id);

-- Interview Feedback
CREATE TABLE IF NOT EXISTS interview_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES interview_answers(id) ON DELETE CASCADE,
    strengths TEXT[] DEFAULT '{}',
    gaps TEXT[] DEFAULT '{}',
    concrete_improvement TEXT,
    sample_ideal_response TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Interview Followups
CREATE TABLE IF NOT EXISTS interview_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    followup_text TEXT NOT NULL,
    reason_for_followup TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI Panel Personas
CREATE TABLE IF NOT EXISTS panel_personas (
    id VARCHAR(50) PRIMARY KEY, -- HR, TECH_LEAD, HIRING_MGR, ARCHITECT
    display_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    focus_areas TEXT[] NOT NULL DEFAULT '{}',
    questioning_style TEXT NOT NULL,
    evaluation_criteria TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- AI Panel Sessions
CREATE TABLE IF NOT EXISTS panel_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    active_persona_id VARCHAR(50) REFERENCES panel_personas(id),
    current_turn INT NOT NULL DEFAULT 1,
    shared_context JSONB DEFAULT '{}',
    consensus_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_panel_sessions_session ON panel_sessions(session_id);

-- Panel Turns (Cross-examination and challenge)
CREATE TABLE IF NOT EXISTS panel_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panel_session_id UUID NOT NULL REFERENCES panel_sessions(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    persona_id VARCHAR(50) NOT NULL REFERENCES panel_personas(id),
    action_type VARCHAR(50) NOT NULL, -- QUESTION, CHALLENGE, FOLLOWUP, ACKNOWLEDGEMENT
    content TEXT NOT NULL,
    referenced_previous_turn_id UUID REFERENCES panel_turns(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_panel_turns_session ON panel_turns(panel_session_id);

-- Panel Evaluations (Individual persona scores)
CREATE TABLE IF NOT EXISTS panel_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panel_session_id UUID NOT NULL REFERENCES panel_sessions(id) ON DELETE CASCADE,
    persona_id VARCHAR(50) NOT NULL REFERENCES panel_personas(id),
    verdict VARCHAR(50) NOT NULL, -- STRONG_HIRE, HIRE, LEANING_HIRE, LEANING_REJECT, REJECT
    score NUMERIC(5,2) NOT NULL,
    key_strengths TEXT[] DEFAULT '{}',
    key_concerns TEXT[] DEFAULT '{}',
    detailed_feedback TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Panel Final Reports (Synthesized across all 4 personas)
CREATE TABLE IF NOT EXISTS panel_final_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panel_session_id UUID NOT NULL REFERENCES panel_sessions(id) ON DELETE CASCADE,
    overall_recommendation VARCHAR(50) NOT NULL,
    overall_score NUMERIC(5,2) NOT NULL,
    persona_breakdown JSONB NOT NULL,
    synthesized_strengths TEXT[] DEFAULT '{}',
    synthesized_gaps TEXT[] DEFAULT '{}',
    hiring_risk_analysis TEXT,
    actionable_roadmap_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
