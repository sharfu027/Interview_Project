-- V2__init_resumes_and_jobs.sql
-- InterviewOS Schema: Resumes, Job Postings, Matching, and Applications

-- Resumes
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Resume Versions
CREATE TABLE IF NOT EXISTS resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (resume_id, version_number)
);

-- Resume Parse Results
CREATE TABLE IF NOT EXISTS resume_parse_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    parser_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    parser_version VARCHAR(50) NOT NULL,
    raw_text TEXT,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(100),
    summary TEXT,
    ats_score NUMERIC(5,2),
    ats_feedback JSONB,
    education JSONB DEFAULT '[]',
    work_experience JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    extracted_keywords TEXT[] DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resume_parse_results_resume ON resume_parse_results(resume_id);

-- Resume Skills
CREATE TABLE IF NOT EXISTS resume_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'TECHNICAL', -- TECHNICAL, SOFT_SKILL, TOOL, FRAMEWORK
    proficiency VARCHAR(50) DEFAULT 'INTERMEDIATE',
    years_of_experience NUMERIC(4,1),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resume_skills_resume ON resume_skills(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_skills_name ON resume_skills(skill_name);

-- Resume Projects
CREATE TABLE IF NOT EXISTS resume_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resume_projects_resume ON resume_projects(resume_id);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    industry VARCHAR(100),
    headquarters VARCHAR(100),
    overview TEXT,
    interview_process_notes TEXT,
    typical_rounds JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Job Sources
CREATE TABLE IF NOT EXISTS job_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- USER_INPUT, RECRUITER_POSTING, SCRAPED, API
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Job Postings
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    job_family VARCHAR(100) NOT NULL, -- JAVA, DOTNET, FRONTEND, BACKEND, FULLSTACK, QA, DATA_ENGINEERING
    seniority VARCHAR(50) NOT NULL DEFAULT 'MID', -- ENTRY, JUNIOR, MID, SENIOR, LEAD, PRINCIPAL
    location VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'FULL_TIME',
    remote_policy VARCHAR(50) DEFAULT 'HYBRID', -- REMOTE, HYBRID, ONSITE
    raw_description TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    external_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_postings_title ON job_postings(title);
CREATE INDEX IF NOT EXISTS idx_job_postings_family ON job_postings(job_family);

-- Job Requirements
CREATE TABLE IF NOT EXISTS job_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    minimum_years NUMERIC(4,1),
    weight NUMERIC(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_requirements_job ON job_requirements(job_id);

-- Candidate Job Matches
CREATE TABLE IF NOT EXISTS candidate_job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    match_score NUMERIC(5,2) NOT NULL, -- 0 to 100
    matched_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    analysis_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (resume_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_candidate_job_matches_user ON candidate_job_matches(user_id);

-- Saved Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, job_id)
);

-- Applications (Candidate Application Tracker)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED', -- SAVED, APPLIED, SCREENING, INTERVIEWING, OFFER, REJECTED, WITHDRAWN
    current_stage VARCHAR(100) DEFAULT 'Application Submitted',
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary_offered NUMERIC(12,2),
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Application Events
CREATE TABLE IF NOT EXISTS application_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- STAGE_CHANGED, NOTE_ADDED, INTERVIEW_SCHEDULED, OFFER_RECEIVED
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
