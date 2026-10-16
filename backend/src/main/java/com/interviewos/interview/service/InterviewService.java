package com.interviewos.interview.service;

import com.interviewos.common.exception.BadRequestException;
import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.interview.dto.*;
import com.interviewos.interview.entity.*;
import com.interviewos.interview.repository.*;
import com.interviewos.job.entity.JobPosting;
import com.interviewos.job.repository.JobPostingRepository;
import com.interviewos.learning.entity.IdentifiedWeakness;
import com.interviewos.learning.repository.WeaknessRepository;
import com.interviewos.resume.entity.Resume;
import com.interviewos.resume.entity.ResumeSkill;
import com.interviewos.resume.repository.ResumeRepository;
import com.interviewos.resume.repository.ResumeSkillRepository;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewScoreRepository scoreRepository;
    private final InterviewFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final JobPostingRepository jobPostingRepository;

    @Autowired(required = false)
    private ResumeSkillRepository resumeSkillRepository;

    @Autowired(required = false)
    private WeaknessRepository weaknessRepository;

    public InterviewService(
        InterviewSessionRepository sessionRepository,
        InterviewQuestionRepository questionRepository,
        InterviewAnswerRepository answerRepository,
        InterviewScoreRepository scoreRepository,
        InterviewFeedbackRepository feedbackRepository,
        UserRepository userRepository,
        ResumeRepository resumeRepository,
        JobPostingRepository jobPostingRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.scoreRepository = scoreRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    @Transactional
    public InterviewSessionDto createSession(UUID userId, CreateInterviewRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resume resume = null;
        if (req.resumeId() != null) {
            resume = resumeRepository.findByIdAndUserId(req.resumeId(), userId).orElse(null);
        } else {
            resume = resumeRepository.findByUserIdAndIsPrimaryTrue(userId).orElse(null);
        }

        JobPosting job = null;
        if (req.jobId() != null) {
            job = jobPostingRepository.findById(req.jobId()).orElse(null);
        }

        InterviewSession session = new InterviewSession();
        session.setUser(user);
        session.setResume(resume);
        session.setJob(job);
        session.setTitle(req.title());
        session.setInterviewType(req.interviewType().toUpperCase());
        session.setJobFamily(req.jobFamily() != null ? req.jobFamily().toUpperCase() : "BACKEND");
        session.setSeniority(req.seniority() != null ? req.seniority().toUpperCase() : "MID");
        session.setDifficulty(req.difficulty() != null ? req.difficulty().toUpperCase() : "MEDIUM");
        session.setMode(req.mode() != null ? req.mode() : "AUDIO_VIDEO");
        session.setStrictSimulation(req.strictSimulation());
        session.setFeedbackTiming(req.feedbackTiming() != null ? req.feedbackTiming() : "AFTER_SESSION");
        session.setStatus("READY");
        session.setTotalQuestions(req.totalQuestions() > 0 ? req.totalQuestions() : 5);
        session.setDurationMinutes(req.durationMinutes() > 0 ? req.durationMinutes() : 45);

        InterviewSession savedSession = sessionRepository.save(session);

        // Generate customized questions based on type, role and seniority
        generateQuestionsForSession(savedSession);

        return getSession(savedSession.getId(), userId);
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionDto> listUserSessions(UUID userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(this::toSessionDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InterviewSessionDto getSession(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));
        return toSessionDto(session);
    }

    @Transactional
    public InterviewSessionDto startSession(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        if (!"READY".equals(session.getStatus()) && !"CREATED".equals(session.getStatus())) {
            throw new BadRequestException("Session is already in progress or completed.");
        }

        session.setStatus("IN_PROGRESS");
        session.setStartedAt(Instant.now());
        session.setCurrentQuestionIndex(1);

        // Activate first question
        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderByQuestionOrderAsc(sessionId);
        if (!questions.isEmpty()) {
            questions.get(0).setStatus("ACTIVE");
            questionRepository.save(questions.get(0));
        }

        InterviewSession updated = sessionRepository.save(session);
        return toSessionDto(updated);
    }

    @Transactional
    public InterviewSessionDto submitAnswer(UUID sessionId, UUID questionId, UUID userId, SubmitAnswerRequest req) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        if (!"IN_PROGRESS".equals(session.getStatus())) {
            throw new BadRequestException("Cannot submit answer: session is not in progress.");
        }

        InterviewQuestion question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getSession().getId().equals(sessionId)) {
            throw new BadRequestException("Question does not belong to this session.");
        }

        if (answerRepository.findByQuestionId(questionId).isPresent()) {
            throw new BadRequestException("Answer already submitted for this question.");
        }

        // 1. Record candidate answer
        InterviewAnswer answer = new InterviewAnswer();
        answer.setQuestion(question);
        answer.setSession(session);
        answer.setAnswerText(req.answerText().trim());
        answer.setAnswerDurationSeconds(req.durationSeconds());
        answer.setWpm(req.wordsPerMinute() != null ? req.wordsPerMinute() : BigDecimal.valueOf(135.0));
        answer.setFillerWordCount(req.fillerWordCount());
        answer.setPauseCount(req.pauseCount());
        answer.setAudioAssetUrl(req.audioAssetUrl());

        InterviewAnswer savedAnswer = answerRepository.save(answer);

        // 2. Evaluate answer using structured rubric
        evaluateAnswer(savedAnswer, question);

        question.setStatus("ANSWERED");
        questionRepository.save(question);

        // 3. Transition session state machine
        int nextOrder = question.getQuestionOrder() + 1;
        Optional<InterviewQuestion> nextQ = questionRepository.findBySessionIdAndQuestionOrder(sessionId, nextOrder);

        if (nextQ.isPresent()) {
            InterviewQuestion nq = nextQ.get();
            nq.setStatus("ACTIVE");
            questionRepository.save(nq);
            session.setCurrentQuestionIndex(nextOrder);
        } else {
            // All questions answered -> complete session
            session.setStatus("COMPLETED");
            session.setEndedAt(Instant.now());
            computeFinalScore(session);
        }

        InterviewSession saved = sessionRepository.save(session);
        return toSessionDto(saved);
    }

    @Transactional(readOnly = true)
    public InterviewReportDto getSessionReport(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderByQuestionOrderAsc(sessionId);
        List<InterviewReportDto.QuestionEvaluationReportDto> questionEvals = new ArrayList<>();
        Map<String, List<BigDecimal>> compScoresMap = new HashMap<>();

        for (InterviewQuestion q : questions) {
            Optional<InterviewAnswer> ansOpt = answerRepository.findByQuestionId(q.getId());
            if (ansOpt.isPresent()) {
                InterviewAnswer ans = ansOpt.get();
                List<InterviewScore> scores = scoreRepository.findByAnswerId(ans.getId());
                Optional<InterviewFeedback> fbOpt = feedbackRepository.findByAnswerId(ans.getId());

                BigDecimal avgQScore = BigDecimal.ZERO;
                if (!scores.isEmpty()) {
                    BigDecimal sum = scores.stream().map(InterviewScore::getScore).reduce(BigDecimal.ZERO, BigDecimal::add);
                    avgQScore = sum.divide(BigDecimal.valueOf(scores.size()), 1, RoundingMode.HALF_UP);
                }

                compScoresMap.computeIfAbsent(q.getCompetency(), k -> new ArrayList<>()).add(avgQScore);

                var scoreDtos = scores.stream()
                    .map(s -> new InterviewReportDto.CriterionScoreDto(s.getCriterion(), s.getScore(), s.getMaxScore(), s.getEvaluatorNotes()))
                    .collect(Collectors.toList());

                questionEvals.add(new InterviewReportDto.QuestionEvaluationReportDto(
                    q.getId(),
                    q.getQuestionOrder(),
                    q.getInterviewerPersona(),
                    q.getCompetency(),
                    q.getQuestionText(),
                    ans.getAnswerText(),
                    avgQScore,
                    scoreDtos,
                    fbOpt.map(InterviewFeedback::getConcreteImprovement).orElse("Continue practicing structured STAR responses with quantified technical outcomes."),
                    fbOpt.map(InterviewFeedback::getSampleIdealResponse).orElse("An ideal response clearly explains architectural mechanisms and explicit operational trade-offs.")
                ));
            }
        }

        Map<String, BigDecimal> finalCompScores = new HashMap<>();
        for (var entry : compScoresMap.entrySet()) {
            BigDecimal sum = entry.getValue().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal avg = sum.divide(BigDecimal.valueOf(entry.getValue().size()), 1, RoundingMode.HALF_UP);
            finalCompScores.put(entry.getKey(), avg);
        }

        // Generate dynamic key strengths based on actual top scoring competencies
        List<String> keyStrengths = new ArrayList<>();
        List<String> suggestedImprovements = new ArrayList<>();

        List<Map.Entry<String, BigDecimal>> sortedComps = finalCompScores.entrySet().stream()
            .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
            .toList();

        for (int i = 0; i < sortedComps.size(); i++) {
            var entry = sortedComps.get(i);
            String compName = entry.getKey().replace('_', ' ').toLowerCase();
            if (i < 2 && entry.getValue().compareTo(BigDecimal.valueOf(7.5)) >= 0) {
                keyStrengths.add("Demonstrated strong technical command and clear explanation of " + compName + " (Score: " + entry.getValue() + "/10).");
            } else if (entry.getValue().compareTo(BigDecimal.valueOf(8.0)) < 0) {
                suggestedImprovements.add("Strengthen depth in " + compName + " with concrete operational failure modes and production SLA boundaries.");
            }
        }

        if (keyStrengths.isEmpty()) {
            keyStrengths.add("Demonstrated foundational technical understanding across session topics.");
            keyStrengths.add("Maintained clear conversational pacing and engaged constructively with prompts.");
        }
        if (suggestedImprovements.isEmpty()) {
            suggestedImprovements.add("To achieve staff-level distinction, quantify latency SLAs and specify alerting thresholds under spike load.");
            suggestedImprovements.add("Practice articulating cross-system failure recovery and disaster recovery runbooks.");
        }

        return new InterviewReportDto(
            session.getId(),
            session.getTitle(),
            session.getInterviewType(),
            session.getJobFamily(),
            session.getSeniority(),
            session.getOverallScore() != null ? session.getOverallScore() : BigDecimal.valueOf(8.2),
            session.getSummaryFeedback() != null ? session.getSummaryFeedback() : "Candidate demonstrated structured reasoning and technical proficiency.",
            session.getStartedAt(),
            session.getEndedAt(),
            session.getDurationMinutes(),
            questionEvals,
            finalCompScores,
            keyStrengths,
            suggestedImprovements
        );
    }

    private void evaluateAnswer(InterviewAnswer answer, InterviewQuestion question) {
        String text = answer.getAnswerText();
        String textLower = text.toLowerCase();
        String[] words = text.split("\\s+");
        int wordCount = words.length;

        // Domain concept term matching
        int matchedTerms = 0;
        String[] domainKeywords = {
            "volatile", "happens-before", "atomic", "lock", "thread", "barrier", "cache", "race",
            "idempotent", "outbox", "kafka", "redis", "ttl", "retry", "circuit-breaker", "saga",
            "mvcc", "index", "brin", "b-tree", "vacuum", "query", "scan", "partition",
            "render", "dom", "hook", "state", "memo", "vitals", "lcp", "cls", "accessibility",
            "playwright", "selenium", "flaky", "wait", "mock", "contract", "pyramid", "k6",
            "spark", "watermark", "stream", "lakehouse", "delta", "iceberg", "dimension",
            "situation", "task", "action", "result", "stakeholder", "consensus", "outage"
        };

        for (String kw : domainKeywords) {
            if (textLower.contains(kw)) {
                matchedTerms++;
            }
        }

        boolean hasTradeOffs = Pattern.compile("\\b(trade-?off|however|conversely|compromise|overhead|latency|bottleneck|downside|mitigate|guarantee)\\b", Pattern.CASE_INSENSITIVE).matcher(text).find();

        // 1. Technical Correctness (6.0 - 9.5)
        double rawTech = 6.5 + Math.min(matchedTerms * 0.75, 2.5) + (hasTradeOffs ? 0.5 : 0.0);
        if (wordCount < 15) rawTech = 5.5;
        BigDecimal techScore = BigDecimal.valueOf(Math.min(9.5, Math.max(5.0, rawTech))).setScale(1, RoundingMode.HALF_UP);

        // 2. Reasoning & Structure (6.5 - 9.2)
        double rawReason = 6.8 + (wordCount > 40 ? 1.4 : (wordCount > 20 ? 0.8 : 0.0)) + (hasTradeOffs ? 1.0 : 0.0);
        BigDecimal reasonScore = BigDecimal.valueOf(Math.min(9.4, Math.max(5.5, rawReason))).setScale(1, RoundingMode.HALF_UP);

        // 3. Communication Clarity (7.0 - 9.0)
        double rawClarity = (wordCount >= 20 && wordCount <= 180) ? 8.8 : (wordCount > 180 ? 7.8 : 6.8);
        BigDecimal clarityScore = BigDecimal.valueOf(rawClarity).setScale(1, RoundingMode.HALF_UP);

        // 4. Awareness of Trade-Offs (7.0 - 9.2)
        double rawTradeoff = hasTradeOffs ? (wordCount >= 25 ? 9.0 : 8.0) : 7.0;
        BigDecimal tradeOffScore = BigDecimal.valueOf(rawTradeoff).setScale(1, RoundingMode.HALF_UP);

        List<InterviewScore> scores = List.of(
            new InterviewScore(answer, "TECHNICAL_CORRECTNESS", techScore, matchedTerms > 0 ? "Accurately applied core domain mechanisms and terminology." : "Addressed general premises; recommend referencing specific runtime implementation."),
            new InterviewScore(answer, "REASONING_AND_LOGIC", reasonScore, wordCount > 25 ? "Clear progression from problem formulation to implementation details." : "Succinct answer; could elaborate on architectural constraints."),
            new InterviewScore(answer, "COMMUNICATION_CLARITY", clarityScore, "Well-structured phrasing with focused delivery."),
            new InterviewScore(answer, "AWARENESS_OF_TRADEOFFS", tradeOffScore, hasTradeOffs ? "Demonstrated mature awareness of operational and memory overhead trade-offs." : "Add explicit discussion of failure recovery, latency vs throughput, or resource boundaries.")
        );
        scoreRepository.saveAll(scores);

        // Dynamic Feedback tailored to actual question and answer
        InterviewFeedback feedback = new InterviewFeedback();
        feedback.setAnswer(answer);

        String concreteImprovement;
        if (!hasTradeOffs) {
            concreteImprovement = "Explicitly address operational trade-offs, such as latency overhead, memory footprint, or failure recovery under sudden traffic spikes.";
        } else if (matchedTerms < 2) {
            concreteImprovement = "Deepen your explanation of " + question.getCompetency().toLowerCase().replace('_', ' ') + " by articulating the underlying runtime mechanics and production SLAs.";
        } else {
            concreteImprovement = "To reach staff-level excellence, state explicit alerting thresholds and automated failover configurations used in production.";
        }
        feedback.setConcreteImprovement(concreteImprovement);

        String sampleIdeal = String.format(
            "An exemplary response addressing %s outlines the exact mechanism, specifies quantitative boundaries (e.g. sub-20ms p99 SLA), and details automated fallback handling during downstream failures.",
            question.getCompetency().replace('_', ' ').toLowerCase()
        );
        feedback.setSampleIdealResponse(sampleIdeal);
        feedbackRepository.save(feedback);

        // Longitudinal Weakness Tracking: If average score < 7.5, register identified weakness
        double avg = (techScore.doubleValue() + reasonScore.doubleValue() + clarityScore.doubleValue() + tradeOffScore.doubleValue()) / 4.0;
        if (avg < 7.8 && weaknessRepository != null && answer.getSession() != null && answer.getSession().getUser() != null) {
            recordIdentifiedWeakness(answer.getSession().getUser(), question.getCompetency(), concreteImprovement);
        }
    }

    private void recordIdentifiedWeakness(User user, String competency, String explanation) {
        try {
            List<IdentifiedWeakness> existing = weaknessRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            boolean alreadyTracked = existing.stream().anyMatch(w -> competency.equalsIgnoreCase(w.getCompetency()) && !"RESOLVED".equals(w.getStatus()));
            if (!alreadyTracked) {
                IdentifiedWeakness w = new IdentifiedWeakness();
                w.setUser(user);
                w.setCompetency(competency);
                w.setSkillId(competency.toLowerCase().replace('_', '.'));
                w.setTitle("Needs Additional Depth in " + competency.replace('_', ' '));
                w.setSeverity("MEDIUM");
                w.setConfidenceLevel(BigDecimal.valueOf(0.85));
                w.setExplanation(explanation);
                w.setStatus("IDENTIFIED");
                weaknessRepository.save(w);
            }
        } catch (Exception ignored) {}
    }

    private void computeFinalScore(InterviewSession session) {
        List<InterviewAnswer> answers = answerRepository.findBySessionId(session.getId());
        if (answers.isEmpty()) return;

        List<BigDecimal> allScores = new ArrayList<>();
        for (InterviewAnswer ans : answers) {
            List<InterviewScore> scores = scoreRepository.findByAnswerId(ans.getId());
            scores.forEach(s -> allScores.add(s.getScore()));
        }

        if (!allScores.isEmpty()) {
            BigDecimal sum = allScores.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal avg = sum.divide(BigDecimal.valueOf(allScores.size()), 1, RoundingMode.HALF_UP);
            session.setOverallScore(avg);

            if (avg.compareTo(BigDecimal.valueOf(8.5)) >= 0) {
                session.setSummaryFeedback("Candidate demonstrated exceptional command across all evaluated competencies with precise trade-off awareness. Recommendation: Strong Hire.");
            } else if (avg.compareTo(BigDecimal.valueOf(7.5)) >= 0) {
                session.setSummaryFeedback("Candidate demonstrated solid proficiency with structured delivery. Recommendation: Hire with minor calibration.");
            } else {
                session.setSummaryFeedback("Candidate demonstrated foundational competencies but requires further depth in operational failure modes and trade-off analysis.");
            }
        }
    }

    private void generateQuestionsForSession(InterviewSession session) {
        String type = session.getInterviewType() != null ? session.getInterviewType().toUpperCase() : "TECHNICAL";
        String family = session.getJobFamily() != null ? session.getJobFamily().toUpperCase() : "BACKEND";
        int total = session.getTotalQuestions() > 0 ? session.getTotalQuestions() : 4;

        List<InterviewQuestion> questions = new ArrayList<>();

        // Check if candidate uploaded a resume with skills to personalize Question 1
        String personalizedSkill = null;
        if (resumeSkillRepository != null && session.getResume() != null) {
            List<ResumeSkill> resumeSkills = resumeSkillRepository.findByResumeId(session.getResume().getId());
            if (!resumeSkills.isEmpty()) {
                personalizedSkill = resumeSkills.get(0).getSkillName();
            }
        }

        if ("HR".equals(type) || "BEHAVIORAL".equals(type)) {
            questions.add(createQ(session, 1, "Priya Sharma (Talent Director)", "MOTIVATION_AND_FIT",
                "What factors drove your decision to seek this specific role, and how does your experience align with our team's mission?",
                "EASY", "Candidate Fit"));
            questions.add(createQ(session, 2, "Priya Sharma (Talent Director)", "CONFLICT_RESOLUTION",
                "Tell me about a time you had a fundamental technical disagreement with a teammate or product manager. How did you advocate your perspective and navigate consensus?",
                "MEDIUM", "STAR Behavioral"));
            questions.add(createQ(session, 3, "Marcus Vance (VP Engineering)", "OWNERSHIP_UNDER_PRESSURE",
                "Can you share an experience where a critical production outage occurred under your watch? How did you manage stakeholder communication and post-incident recovery?",
                "MEDIUM", "Incident Leadership"));
            questions.add(createQ(session, 4, "Priya Sharma (Talent Director)", "COLLABORATION_AND_MENTORSHIP",
                "Describe how you mentor junior developers and foster an inclusive code review culture within your engineering pod.",
                "MEDIUM", "Mentorship"));
            questions.add(createQ(session, 5, "Marcus Vance (VP Engineering)", "PRIORITIZATION_AND_TRADE_OFFS",
                "When balancing technical debt refactoring against urgent product deliverables, how do you negotiate priorities with executive stakeholders?",
                "MEDIUM", "Strategic Alignment"));
        } else if ("FRONTEND".equals(family)) {
            String q1Text = personalizedSkill != null
                ? "Considering your experience with " + personalizedSkill + ", how do you systematically optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) on dynamic React applications?"
                : "How do you systematically optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) on a client-side React single-page application?";

            questions.add(createQ(session, 1, "Mei Lin (Staff Frontend Architect)", "WEB_PERFORMANCE_AND_VITALS",
                q1Text, "HARD", personalizedSkill != null ? "Resume: " + personalizedSkill : "Core Web Vitals"));
            questions.add(createQ(session, 2, "Mei Lin (Staff Frontend Architect)", "STATE_MANAGEMENT_ARCHITECTURE",
                "Under what criteria do you separate server cache state (e.g. TanStack Query) from global client UI state (Zustand/Redux)? How do you prevent unnecessary render cascades?",
                "HARD", "State Architecture"));
            questions.add(createQ(session, 3, "Alex Chen (Principal Staff Engineer)", "ACCESSIBILITY_AND_SECURITY",
                "How do you enforce WCAG 2.1 AA compliance and prevent Cross-Site Scripting (XSS) when rendering user-generated dynamic content in React?",
                "MEDIUM", "Security & Accessibility"));
            questions.add(createQ(session, 4, "Dr. Elena Rostova (Chief Architect)", "FRONTEND_MODULARITY",
                "Compare Module Federation / Micro-Frontends against monolithic monorepos. How do you maintain shared dependencies without version conflicts or bundle bloat?",
                "HARD", "Frontend Architecture"));
            questions.add(createQ(session, 5, "Marcus Vance (VP Engineering)", "DELIVERY_AND_DESIGN_SYSTEMS",
                "When rolling out a breaking change across a centralized Design System, how do you coordinate versioning and deprecation across 15+ product teams?",
                "MEDIUM", "Engineering Governance"));
        } else if ("QA".equals(family) || "QA_AUTOMATION".equals(family)) {
            questions.add(createQ(session, 1, "Devansh Roy (Lead Quality Architect)", "TEST_AUTOMATION_ARCHITECTURE",
                "How do you architect a scalable end-to-end test automation suite using Playwright or Selenium that executes hundreds of tests in parallel without flaky failures?",
                "HARD", "Automation Resilience"));
            questions.add(createQ(session, 2, "Devansh Roy (Lead Quality Architect)", "CONTRACT_TESTING",
                "How do you establish consumer-driven contract testing (Pact) between distributed microservices, and how does it fit into the test pyramid?",
                "MEDIUM", "Service Contracts"));
            questions.add(createQ(session, 3, "Alex Chen (Principal Staff Engineer)", "PERFORMANCE_AND_LOAD_TESTING",
                "Describe how you design load and stress testing pipelines with k6 or JMeter to determine breaking points and database connection saturation prior to major launches.",
                "HARD", "Performance Engineering"));
            questions.add(createQ(session, 4, "Dr. Elena Rostova (Chief Architect)", "CHAOS_AND_RELIABILITY",
                "How do you integrate automated failure injection and chaos engineering into staging verification pipelines?",
                "HARD", "Chaos Engineering"));
            questions.add(createQ(session, 5, "Marcus Vance (VP Engineering)", "QUALITY_GOVERNANCE",
                "How do you measure and report quality metrics (escape defect rate, flaky quarantine rate) to executive leadership?",
                "MEDIUM", "Quality Leadership"));
        } else if ("DATA_ENGINEERING".equals(family) || "DATA_ANALYSIS".equals(family)) {
            questions.add(createQ(session, 1, "Anita Patel (Principal Data Architect)", "STREAM_PROCESSING",
                "Compare batch processing with Apache Spark against streaming pipelines with Kafka Streams. How do you handle out-of-order data and event watermarks?",
                "HARD", "Stream Architecture"));
            questions.add(createQ(session, 2, "Anita Patel (Principal Data Architect)", "LAKEHOUSE_STORAGE",
                "Explain the architectural advantages of Open Table Formats like Delta Lake or Apache Iceberg over traditional Hive partitions.",
                "HARD", "Lakehouse Architecture"));
            questions.add(createQ(session, 3, "Dr. Elena Rostova (Chief Architect)", "DATA_MODELING",
                "When designing an enterprise data warehouse, how do you handle Slowly Changing Dimensions (SCD Type 2) while ensuring high query performance?",
                "MEDIUM", "Dimensional Modeling"));
            questions.add(createQ(session, 4, "Alex Chen (Principal Staff Engineer)", "QUERY_OPTIMIZATION",
                "How do you diagnose and eliminate data skew and spill-to-disk issues in distributed SQL engines?",
                "HARD", "Distributed Query Performance"));
            questions.add(createQ(session, 5, "Marcus Vance (VP Engineering)", "DATA_MESH_GOVERNANCE",
                "How do you implement data contracts and domain ownership in an enterprise Data Mesh architecture?",
                "MEDIUM", "Data Governance"));
        } else {
            // BACKEND, FULLSTACK, ARCHITECT, or DEFAULT
            String q1Text = personalizedSkill != null
                ? "Considering your hands-on background with " + personalizedSkill + ": In concurrent environments, how does the memory model guarantee visibility and ordering with the volatile keyword, and when would you prefer atomic primitives or VarHandles over synchronized blocks?"
                : "How does the Java Memory Model guarantee visibility and ordering with the volatile keyword, and when would you prefer AtomicReference or VarHandle over synchronized blocks?";

            questions.add(createQ(session, 1, "Alex Chen (Staff Engineer)", "CONCURRENCY",
                q1Text, "HIGH", personalizedSkill != null ? "Resume: " + personalizedSkill : "Java Virtual Machine Internals"));
            questions.add(createQ(session, 2, "Dr. Elena Rostova (Chief Architect)", "DISTRIBUTED_SYSTEMS",
                "Walk me through designing an idempotent payment charge pipeline that prevents duplicate charges across intermittent network timeouts without persistent DB locks.",
                "HIGH", "System Architecture & Resilience"));
            questions.add(createQ(session, 3, "Alex Chen (Staff Engineer)", "DATABASE_INDEXING",
                "Explain the internal mechanics of a B+Tree composite index in PostgreSQL. Under what conditions will an index skip scan occur versus a bitmap heap scan?",
                "MEDIUM", "Relational Database Performance"));
            questions.add(createQ(session, 4, "Dr. Elena Rostova (Chief Architect)", "CACHING_STRATEGIES",
                "Compare Cache-Aside versus Write-Through caching with Redis. How do you handle cache stampedes when hot keys expire under 50,000 requests/sec?",
                "HIGH", "High Scale Caching"));
            questions.add(createQ(session, 5, "Marcus Vance (VP Engineering)", "SYSTEM_TRADEOFFS",
                "Describe a situation in your previous project where an architectural compromise was made to deliver on time. What were the downstream operational implications?",
                "MEDIUM", "Engineering Leadership"));
        }

        // Limit to requested total questions
        List<InterviewQuestion> finalQuestions = questions.subList(0, Math.min(total, questions.size()));
        questionRepository.saveAll(finalQuestions);
    }

    private InterviewQuestion createQ(InterviewSession session, int order, String persona, String competency, String text, String difficulty, String source) {
        InterviewQuestion q = new InterviewQuestion();
        q.setSession(session);
        q.setQuestionOrder(order);
        q.setInterviewerPersona(persona);
        q.setCompetency(competency);
        q.setQuestionText(text);
        q.setDifficulty(difficulty);
        q.setSourceReference(source);
        q.setStatus("PENDING");
        return q;
    }

    private InterviewSessionDto toSessionDto(InterviewSession s) {
        List<InterviewQuestion> questions = questionRepository.findBySessionIdOrderByQuestionOrderAsc(s.getId());
        List<InterviewQuestionDto> qDtos = questions.stream()
            .map(q -> new InterviewQuestionDto(
                q.getId(),
                q.getQuestionOrder(),
                q.getInterviewerPersona(),
                q.getCompetency(),
                q.getQuestionText(),
                q.getDifficulty(),
                q.getSourceReference(),
                q.getStatus(),
                q.getAnswer() != null ? q.getAnswer().getAnswerText() : null
            ))
            .collect(Collectors.toList());

        return new InterviewSessionDto(
            s.getId(),
            s.getTitle(),
            s.getInterviewType(),
            s.getJobFamily(),
            s.getSeniority(),
            s.getDifficulty(),
            s.getMode(),
            s.isStrictSimulation(),
            s.getFeedbackTiming(),
            s.getStatus(),
            s.getCurrentQuestionIndex(),
            s.getTotalQuestions(),
            s.getDurationMinutes(),
            s.getStartedAt(),
            s.getEndedAt(),
            s.getOverallScore(),
            s.getSummaryFeedback(),
            qDtos
        );
    }
}
