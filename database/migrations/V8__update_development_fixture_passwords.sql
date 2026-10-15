-- V8__update_development_fixture_passwords.sql
-- InterviewOS Schema: Update development demo fixture password hashes
-- Sets verified BCrypt hash for 'Password123!' ($2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee)
-- This migration ensures repeatable schema migration forward without editing historical migration V7 checksums.

UPDATE users 
SET password_hash = '$2b$10$gTFHmYVLWkGCLIRxvzdxWO3WNgL8cxUUu6W7u1euwtpAtynQZs2Ee',
    updated_at = CURRENT_TIMESTAMP
WHERE email IN (
    'candidate@interviewos.dev',
    'recruiter@interviewos.dev',
    'admin@interviewos.dev'
);
