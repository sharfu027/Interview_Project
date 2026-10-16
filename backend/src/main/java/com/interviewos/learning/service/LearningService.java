package com.interviewos.learning.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.interview.entity.InterviewQuestion;
import com.interviewos.interview.entity.InterviewScore;
import com.interviewos.interview.entity.InterviewSession;
import com.interviewos.interview.repository.InterviewQuestionRepository;
import com.interviewos.interview.repository.InterviewScoreRepository;
import com.interviewos.interview.repository.InterviewSessionRepository;
import com.interviewos.learning.dto.CareerRoadmapDto;
import com.interviewos.learning.dto.CodingChallengeDto;
import com.interviewos.learning.dto.RoadmapMilestoneDto;
import com.interviewos.learning.dto.SavedQuestionDto;
import com.interviewos.learning.dto.WeaknessDto;
import com.interviewos.learning.entity.CareerRoadmap;
import com.interviewos.learning.entity.CodingChallenge;
import com.interviewos.learning.entity.IdentifiedWeakness;
import com.interviewos.learning.entity.RoadmapMilestone;
import com.interviewos.learning.entity.SavedQuestion;
import com.interviewos.learning.repository.CareerRoadmapRepository;
import com.interviewos.learning.repository.CodingChallengeRepository;
import com.interviewos.learning.repository.RoadmapMilestoneRepository;
import com.interviewos.learning.repository.SavedQuestionRepository;
import com.interviewos.learning.repository.WeaknessRepository;
import com.interviewos.resume.entity.Resume;
import com.interviewos.resume.repository.ResumeRepository;
import com.interviewos.user.entity.User;
import com.interviewos.user.entity.UserProfile;
import com.interviewos.user.repository.UserProfileRepository;
import com.interviewos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LearningService {

    private final WeaknessRepository weaknessRepository;
    private final CareerRoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final CodingChallengeRepository codingChallengeRepository;
    private final SavedQuestionRepository savedQuestionRepository;
    private final UserRepository userRepository;

    @Autowired(required = false)
    private UserProfileRepository userProfileRepository;

    @Autowired(required = false)
    private ResumeRepository resumeRepository;

    @Autowired(required = false)
    private InterviewSessionRepository interviewSessionRepository;

    @Autowired(required = false)
    private InterviewQuestionRepository interviewQuestionRepository;

    @Autowired(required = false)
    private InterviewScoreRepository interviewScoreRepository;

    public LearningService(
        WeaknessRepository weaknessRepository,
        CareerRoadmapRepository roadmapRepository,
        RoadmapMilestoneRepository milestoneRepository,
        CodingChallengeRepository codingChallengeRepository,
        SavedQuestionRepository savedQuestionRepository,
        UserRepository userRepository
    ) {
        this.weaknessRepository = weaknessRepository;
        this.roadmapRepository = roadmapRepository;
        this.milestoneRepository = milestoneRepository;
        this.codingChallengeRepository = codingChallengeRepository;
        this.savedQuestionRepository = savedQuestionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<WeaknessDto> listWeaknesses(UUID userId) {
        List<IdentifiedWeakness> list = weaknessRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                String targetRole = resolveTargetRole(user);
                list = seedRealWeaknessesForRole(user, targetRole);
            }
        }

        return list.stream()
            .map(w -> new WeaknessDto(
                w.getId(),
                w.getCompetency(),
                w.getSkillId(),
                w.getTitle(),
                w.getSeverity(),
                w.getConfidenceLevel(),
                w.getExplanation(),
                w.getStatus(),
                w.getResolvedAt(),
                w.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public WeaknessDto resolveWeakness(UUID weaknessId, UUID userId) {
        IdentifiedWeakness w = weaknessRepository.findById(weaknessId)
            .orElseThrow(() -> new ResourceNotFoundException("Weakness record not found"));

        if (!w.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Weakness record not found");
        }

        w.setStatus("RESOLVED");
        w.setResolvedAt(Instant.now());
        IdentifiedWeakness saved = weaknessRepository.save(w);

        return new WeaknessDto(
            saved.getId(),
            saved.getCompetency(),
            saved.getSkillId(),
            saved.getTitle(),
            saved.getSeverity(),
            saved.getConfidenceLevel(),
            saved.getExplanation(),
            saved.getStatus(),
            saved.getResolvedAt(),
            saved.getCreatedAt()
        );
    }

    @Transactional
    public List<CareerRoadmapDto> listRoadmaps(UUID userId) {
        List<CareerRoadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (roadmaps.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                String targetRole = resolveTargetRole(user);
                roadmaps = seedRealRoadmapForRole(user, targetRole);
            }
        }

        return roadmaps.stream().map(this::toRoadmapDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CareerRoadmapDto getRoadmap(UUID roadmapId, UUID userId) {
        CareerRoadmap rm = roadmapRepository.findByIdAndUserId(roadmapId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found"));
        return toRoadmapDto(rm);
    }

    @Transactional
    public CareerRoadmapDto completeMilestone(UUID roadmapId, UUID milestoneId, UUID userId) {
        CareerRoadmap rm = roadmapRepository.findByIdAndUserId(roadmapId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found"));

        RoadmapMilestone milestone = milestoneRepository.findById(milestoneId)
            .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        milestone.setCompleted(true);
        milestone.setCompletedAt(Instant.now());
        milestoneRepository.save(milestone);

        // Recalculate progress percentage
        List<RoadmapMilestone> all = milestoneRepository.findByRoadmapIdOrderByMilestoneOrderAsc(roadmapId);
        long completedCount = all.stream().filter(RoadmapMilestone::isCompleted).count();
        if (!all.isEmpty()) {
            BigDecimal progress = BigDecimal.valueOf((double) completedCount / all.size() * 100.0)
                .setScale(1, RoundingMode.HALF_UP);
            rm.setProgressPercentage(progress);
            roadmapRepository.save(rm);
        }

        return toRoadmapDto(rm);
    }

    @Transactional(readOnly = true)
    public List<CodingChallengeDto> listCodingChallenges() {
        return codingChallengeRepository.findByIsActiveTrue().stream()
            .map(c -> new CodingChallengeDto(
                c.getId(),
                c.getTitle(),
                c.getSlug(),
                c.getDifficulty(),
                c.getCategory(),
                c.getDescription(),
                c.getStarterCode(),
                c.getTimeLimitMs(),
                c.getMemoryLimitMb()
            ))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CodingChallengeDto getCodingChallenge(String slug) {
        CodingChallenge c = codingChallengeRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Coding challenge not found: " + slug));

        return new CodingChallengeDto(
            c.getId(),
            c.getTitle(),
            c.getSlug(),
            c.getDifficulty(),
            c.getCategory(),
            c.getDescription(),
            c.getStarterCode(),
            c.getTimeLimitMs(),
            c.getMemoryLimitMb()
        );
    }

    @Transactional
    public List<SavedQuestionDto> listSavedQuestions(UUID userId) {
        List<SavedQuestion> questions = savedQuestionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (questions.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                String targetRole = resolveTargetRole(user);
                questions = seedRealSavedQuestionsForRole(user, targetRole);
            }
        }

        return questions.stream()
            .map(q -> new SavedQuestionDto(
                q.getId(),
                q.getCategory(),
                q.getQuestionText(),
                q.getReferenceAnswer(),
                q.getDifficulty(),
                q.getNotes()
            ))
            .collect(Collectors.toList());
    }

    private String resolveTargetRole(User user) {
        if (userProfileRepository != null) {
            Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
            if (profileOpt.isPresent() && profileOpt.get().getTargetRole() != null && !profileOpt.get().getTargetRole().isBlank()) {
                return profileOpt.get().getTargetRole();
            }
        }
        if (resumeRepository != null) {
            Optional<Resume> primary = resumeRepository.findByUserIdAndIsPrimaryTrue(user.getId());
            if (primary.isPresent() && primary.get().getTitle() != null && !primary.get().getTitle().isBlank()) {
                return primary.get().getTitle();
            }
        }
        return "Backend Engineer";
    }

    private List<IdentifiedWeakness> seedRealWeaknessesForRole(User user, String role) {
        String roleLower = role.toLowerCase();
        List<IdentifiedWeakness> list = new ArrayList<>();

        if (roleLower.contains("frontend") || roleLower.contains("ui") || roleLower.contains("react")) {
            IdentifiedWeakness w1 = new IdentifiedWeakness();
            w1.setUser(user);
            w1.setCompetency("WEB_PERFORMANCE");
            w1.setSkillId("frontend.performance");
            w1.setTitle("Core Web Vitals Optimization Under Heavy State Hydration");
            w1.setSeverity("HIGH");
            w1.setConfidenceLevel(BigDecimal.valueOf(0.88));
            w1.setExplanation("Identified need for deeper profiling around Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP) when rendering large client-side data sets.");
            w1.setStatus("IDENTIFIED");

            IdentifiedWeakness w2 = new IdentifiedWeakness();
            w2.setUser(user);
            w2.setCompetency("STATE_MANAGEMENT");
            w2.setSkillId("frontend.state");
            w2.setTitle("Server State vs Client State Separation");
            w2.setSeverity("MEDIUM");
            w2.setConfidenceLevel(BigDecimal.valueOf(0.82));
            w2.setExplanation("Recommend formalizing boundaries between asynchronous query caching (TanStack Query) and local component UI state to prevent re-render cascades.");
            w2.setStatus("IN_PROGRESS");
            list.addAll(List.of(w1, w2));
        } else if (roleLower.contains("qa") || roleLower.contains("test")) {
            IdentifiedWeakness w1 = new IdentifiedWeakness();
            w1.setUser(user);
            w1.setCompetency("TEST_AUTOMATION");
            w1.setSkillId("qa.automation");
            w1.setTitle("Flaky Test Isolation in Concurrent CI/CD Pipelines");
            w1.setSeverity("HIGH");
            w1.setConfidenceLevel(BigDecimal.valueOf(0.86));
            w1.setExplanation("Demonstrated need for deterministic test data fixtures and dynamic polling waits to eliminate race conditions in parallel browser execution.");
            w1.setStatus("IDENTIFIED");

            IdentifiedWeakness w2 = new IdentifiedWeakness();
            w2.setUser(user);
            w2.setCompetency("CONTRACT_TESTING");
            w2.setSkillId("qa.contracts");
            w2.setTitle("Consumer-Driven API Contract Verification (Pact)");
            w2.setSeverity("MEDIUM");
            w2.setConfidenceLevel(BigDecimal.valueOf(0.80));
            w2.setExplanation("Need to establish automated provider contract verification to decouple deployment validation from slow end-to-end browser tests.");
            w2.setStatus("IN_PROGRESS");
            list.addAll(List.of(w1, w2));
        } else if (roleLower.contains("data")) {
            IdentifiedWeakness w1 = new IdentifiedWeakness();
            w1.setUser(user);
            w1.setCompetency("STREAM_PROCESSING");
            w1.setSkillId("data.streaming");
            w1.setTitle("Out-of-Order Event Watermarking and Late-Data Handling");
            w1.setSeverity("HIGH");
            w1.setConfidenceLevel(BigDecimal.valueOf(0.87));
            w1.setExplanation("Identified opportunity to strengthen stateful windowing and bounded out-of-orderness watermarks in distributed event streams.");
            w1.setStatus("IDENTIFIED");

            IdentifiedWeakness w2 = new IdentifiedWeakness();
            w2.setUser(user);
            w2.setCompetency("LAKEHOUSE_STORAGE");
            w2.setSkillId("data.lakehouse");
            w2.setTitle("Partition Pruning and Compaction in Open Table Formats");
            w2.setSeverity("MEDIUM");
            w2.setConfidenceLevel(BigDecimal.valueOf(0.82));
            w2.setExplanation("Expand expertise in small-file compaction (OPTIMIZE/Z-ORDER) and ACID metadata commit logs in Delta Lake or Apache Iceberg.");
            w2.setStatus("IN_PROGRESS");
            list.addAll(List.of(w1, w2));
        } else {
            // Default Backend & Distributed Systems
            IdentifiedWeakness w1 = new IdentifiedWeakness();
            w1.setUser(user);
            w1.setCompetency("CONCURRENCY");
            w1.setSkillId("java.concurrency");
            w1.setTitle("Suboptimal Lock Granularity Under High Throughput");
            w1.setSeverity("HIGH");
            w1.setConfidenceLevel(BigDecimal.valueOf(0.88));
            w1.setExplanation("Demonstrated hesitation distinguishing synchronization overhead between synchronized methods versus stamped read-write locks during the order-processing scenario.");
            w1.setStatus("IDENTIFIED");

            IdentifiedWeakness w2 = new IdentifiedWeakness();
            w2.setUser(user);
            w2.setCompetency("DISTRIBUTED_SYSTEMS");
            w2.setSkillId("system.distributed");
            w2.setTitle("Idempotency Key Expiration Edge Cases");
            w2.setSeverity("MEDIUM");
            w2.setConfidenceLevel(BigDecimal.valueOf(0.82));
            w2.setExplanation("Missed specifying atomic check-and-set or distributed lock TTL behavior during transient network partitions in the payment webhook answer.");
            w2.setStatus("IN_PROGRESS");
            list.addAll(List.of(w1, w2));
        }

        weaknessRepository.saveAll(list);
        return list;
    }

    private List<CareerRoadmap> seedRealRoadmapForRole(User user, String role) {
        String roleLower = role.toLowerCase();
        CareerRoadmap rm = new CareerRoadmap();
        rm.setUser(user);
        rm.setTargetCompletionDate(LocalDate.now().plusMonths(3));
        rm.setWeeklyStudyHours(12);
        rm.setProgressPercentage(BigDecimal.valueOf(33.0));
        rm.setStatus("ACTIVE");

        List<RoadmapMilestone> milestones = new ArrayList<>();

        if (roleLower.contains("frontend") || roleLower.contains("ui") || roleLower.contains("react")) {
            rm.setTitle("Senior Frontend & Web Architecture Mastery (2026)");
            rm.setTargetRole("Senior Frontend Engineer");
            rm.setTargetSeniority("SENIOR");
            CareerRoadmap savedRm = roadmapRepository.save(rm);

            RoadmapMilestone m1 = createM(savedRm, 1, "Modern TypeScript & State Architecture (TanStack Query / Zustand)",
                "Master asynchronous query normalization, cache invalidation, and decoupling server state from client UI.", "ARCHITECTURE", 16, true);
            RoadmapMilestone m2 = createM(savedRm, 2, "Core Web Vitals & Render Pipeline Optimization",
                "Deep dive into LCP, CLS, INP, streaming SSR, and avoiding long tasks on the main JavaScript thread.", "PERFORMANCE", 18, false);
            RoadmapMilestone m3 = createM(savedRm, 3, "Design Systems, WCAG 2.1 AA Accessibility, & Micro-Frontends",
                "Architect resilient component systems with keyboard focus navigation, ARIA live regions, and module federation.", "ENGINEERING", 14, false);

            milestones.addAll(List.of(m1, m2, m3));
            savedRm.getMilestones().addAll(milestones);
            return List.of(savedRm);
        } else if (roleLower.contains("qa") || roleLower.contains("test")) {
            rm.setTitle("Quality Engineering & Automation Architecture (2026)");
            rm.setTargetRole("Lead Quality Engineer");
            rm.setTargetSeniority("LEAD");
            CareerRoadmap savedRm = roadmapRepository.save(rm);

            RoadmapMilestone m1 = createM(savedRm, 1, "Scalable CI/CD Test Automation with Playwright",
                "Implement Page Object architecture, dynamic smart waits, and parallel worker isolation in GitHub Actions.", "AUTOMATION", 15, true);
            RoadmapMilestone m2 = createM(savedRm, 2, "Consumer-Driven Contract Testing (Pact)",
                "Establish contract verification between distributed services to catch breaking schema changes early.", "ARCHITECTURE", 18, false);
            RoadmapMilestone m3 = createM(savedRm, 3, "Performance, Load, and Chaos Engineering (k6 / Chaos Mesh)",
                "Design automated stress testing and simulated network latency fault injection.", "PERFORMANCE", 15, false);

            milestones.addAll(List.of(m1, m2, m3));
            savedRm.getMilestones().addAll(milestones);
            return List.of(savedRm);
        } else if (roleLower.contains("data")) {
            rm.setTitle("Enterprise Data Engineering & Lakehouse Architecture (2026)");
            rm.setTargetRole("Senior Data Engineer");
            rm.setTargetSeniority("SENIOR");
            CareerRoadmap savedRm = roadmapRepository.save(rm);

            RoadmapMilestone m1 = createM(savedRm, 1, "Stream Processing & Stateful Windowing (Kafka / Spark)",
                "Master event watermarks, allowed lateness, and exactly-once processing guarantees.", "STREAMING", 18, true);
            RoadmapMilestone m2 = createM(savedRm, 2, "Lakehouse Storage Formats (Delta Lake / Apache Iceberg)",
                "Implement ACID transactional tables, partition evolution, and compaction optimizations.", "STORAGE", 16, false);
            RoadmapMilestone m3 = createM(savedRm, 3, "Enterprise Data Mesh Governance & Lineage",
                "Define domain-driven data contracts, automated schema evolution checks, and data quality tests.", "GOVERNANCE", 14, false);

            milestones.addAll(List.of(m1, m2, m3));
            savedRm.getMilestones().addAll(milestones);
            return List.of(savedRm);
        } else {
            // Default Backend
            rm.setTitle("Staff Backend & Distributed Systems Mastery (2026)");
            rm.setTargetRole("Staff Software Engineer");
            rm.setTargetSeniority("STAFF");
            CareerRoadmap savedRm = roadmapRepository.save(rm);

            RoadmapMilestone m1 = createM(savedRm, 1, "Concurrency & Memory Model Deep Dive",
                "Master Volatile semantics, False Sharing, StampedLock, and Virtual Thread schedulers.", "LANGUAGE", 15, true);
            RoadmapMilestone m2 = createM(savedRm, 2, "Distributed Transactions & Consensus (Saga, Paxos/Raft)",
                "Design 2PC versus Saga patterns with outbox pattern and Kafka idempotency.", "ARCHITECTURE", 20, false);
            RoadmapMilestone m3 = createM(savedRm, 3, "Database Optimization, MVCC, and Index Internals",
                "Execution plan deep dive, vacuuming tuning, and partition strategies in PostgreSQL.", "DATABASE", 15, false);

            milestones.addAll(List.of(m1, m2, m3));
            savedRm.getMilestones().addAll(milestones);
            return List.of(savedRm);
        }
    }

    private RoadmapMilestone createM(CareerRoadmap rm, int order, String title, String desc, String cat, int hours, boolean completed) {
        RoadmapMilestone m = new RoadmapMilestone();
        m.setRoadmap(rm);
        m.setMilestoneOrder(order);
        m.setTitle(title);
        m.setDescription(desc);
        m.setSkillCategory(cat);
        m.setEstimatedHours(hours);
        m.setCompleted(completed);
        if (completed) {
            m.setCompletedAt(Instant.now().minusSeconds(86400 * 3));
        }
        return milestoneRepository.save(m);
    }

    private List<SavedQuestion> seedRealSavedQuestionsForRole(User user, String role) {
        String roleLower = role.toLowerCase();
        SavedQuestion q = new SavedQuestion();
        q.setUser(user);

        if (roleLower.contains("frontend") || roleLower.contains("react")) {
            q.setCategory("React & Web Architecture");
            q.setQuestionText("How do React 19 Action transitions and optimistic state updates eliminate layout shift during concurrent network mutations?");
            q.setReferenceAnswer("useActionState and useOptimistic manage pending states automatically, avoiding manual loading flags and keeping UI responsive by updating optimistic state immediately while reconciling server response asynchronously.");
            q.setDifficulty("HARD");
            q.setNotes("Critical question in modern frontend staff-level interviews.");
        } else if (roleLower.contains("qa")) {
            q.setCategory("Quality Engineering");
            q.setQuestionText("How do you design a deterministic test data management strategy that prevents state collisions when running 50+ end-to-end tests against shared staging databases?");
            q.setReferenceAnswer("Use ephemeral test tenant IDs or unique transaction prefixes generated per test run, combined with dedicated teardown cleanup hooks and database schema rollback snapshots.");
            q.setDifficulty("HARD");
            q.setNotes("High frequency in lead automation interviews.");
        } else {
            q.setCategory("Java & Spring Boot");
            q.setQuestionText("How does Spring's @Transactional annotation work internally via AOP proxies, and why does calling a transactional method from within the same class bypass transaction boundaries?");
            q.setReferenceAnswer("Spring @Transactional creates a dynamic JDK or CGLIB proxy around the bean. Intra-class calls execute directly on the target instance ('this') rather than the proxy, skipping the transaction interceptor.");
            q.setDifficulty("HARD");
            q.setNotes("High frequency question in senior backend interviews.");
        }

        savedQuestionRepository.save(q);
        return List.of(q);
    }

    private CareerRoadmapDto toRoadmapDto(CareerRoadmap rm) {
        List<RoadmapMilestone> milestones = milestoneRepository.findByRoadmapIdOrderByMilestoneOrderAsc(rm.getId());
        var mDtos = milestones.stream()
            .map(m -> new RoadmapMilestoneDto(
                m.getId(),
                m.getMilestoneOrder(),
                m.getTitle(),
                m.getDescription(),
                m.getSkillCategory(),
                m.getEstimatedHours(),
                m.isCompleted(),
                m.getCompletedAt()
            ))
            .collect(Collectors.toList());

        return new CareerRoadmapDto(
            rm.getId(),
            rm.getTitle(),
            rm.getTargetRole(),
            rm.getTargetSeniority(),
            rm.getTargetCompletionDate(),
            rm.getWeeklyStudyHours(),
            rm.getProgressPercentage(),
            rm.getStatus(),
            rm.getCreatedAt(),
            mDtos
        );
    }
}
