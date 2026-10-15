-- V4__init_media_and_speech.sql
-- InterviewOS Schema: Audio/Video Recordings, Consents, Transcripts, and Real-Time Speech Metrics

-- Recording Consents
CREATE TABLE IF NOT EXISTS recording_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    consent_audio BOOLEAN NOT NULL DEFAULT TRUE,
    consent_video BOOLEAN NOT NULL DEFAULT TRUE,
    consent_retention_days INT NOT NULL DEFAULT 30,
    consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    UNIQUE (user_id, session_id)
);

-- Recording Assets
CREATE TABLE IF NOT EXISTS recording_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- AUDIO, VIDEO
    storage_key VARCHAR(500) NOT NULL,
    storage_bucket VARCHAR(100) NOT NULL DEFAULT 'interviewos-recordings',
    file_size_bytes BIGINT NOT NULL,
    duration_seconds INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    retention_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recording_assets_session ON recording_assets(session_id);

-- Transcripts
CREATE TABLE IF NOT EXISTS transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    recording_id UUID REFERENCES recording_assets(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- PROCESSING, COMPLETED, FAILED
    language VARCHAR(10) NOT NULL DEFAULT 'en-US',
    confidence_score NUMERIC(4,3) DEFAULT 0.95,
    full_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transcripts_session ON transcripts(session_id);

-- Transcript Segments (Synchronized with Video/Audio Timestamps)
CREATE TABLE IF NOT EXISTS transcript_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transcript_id UUID NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
    speaker_tag VARCHAR(50) NOT NULL, -- CANDIDATE, INTERVIEWER, AI_PANEL
    start_time_seconds NUMERIC(8,3) NOT NULL,
    end_time_seconds NUMERIC(8,3) NOT NULL,
    segment_text TEXT NOT NULL,
    confidence NUMERIC(4,3) DEFAULT 0.95,
    question_id UUID REFERENCES interview_questions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_transcript_segments_transcript ON transcript_segments(transcript_id);
CREATE INDEX IF NOT EXISTS idx_transcript_segments_times ON transcript_segments(start_time_seconds, end_time_seconds);

-- Speech Metrics (Real-Time Speaking Coach Analytics)
CREATE TABLE IF NOT EXISTS speech_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
    words_per_minute NUMERIC(5,1) NOT NULL,
    total_words INT NOT NULL DEFAULT 0,
    filler_word_count INT NOT NULL DEFAULT 0,
    filler_words_breakdown JSONB DEFAULT '{}', -- e.g. {"um": 3, "uh": 2, "like": 4, "you know": 1}
    pause_count INT NOT NULL DEFAULT 0,
    long_pause_count INT NOT NULL DEFAULT 0, -- pauses > 3 seconds
    speaking_duration_seconds NUMERIC(8,2) NOT NULL,
    clarity_score NUMERIC(4,2) DEFAULT 8.5,
    structure_quality VARCHAR(50) DEFAULT 'GOOD', -- EXCELLENT, GOOD, RAMBLING, INCOMPLETE
    feedback_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_speech_metrics_session ON speech_metrics(session_id);

-- Media Processing Jobs
CREATE TABLE IF NOT EXISTS media_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID NOT NULL REFERENCES recording_assets(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- TRANSCRIBE, COMPRESS, EXTRACT_AUDIO, ANALYZE_SPEECH
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Retention Policies
CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL DEFAULT 30,
    auto_delete BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
