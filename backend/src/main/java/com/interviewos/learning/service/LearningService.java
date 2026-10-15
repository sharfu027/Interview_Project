package com.interviewos.learning.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.learning.dto.*;
import com.interviewos.learning.entity.*;
import com.interviewos.learning.repository.*;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
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

    @Transactional(readOnly = true)
    public List<WeaknessDto> listWeaknesses(UUID userId) {
        List<IdentifiedWeakness> list = weaknessRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
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

                weaknessRepository.saveAll(List.of(w1, w2));
                list = List.of(w1, w2);
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

    @Transactional(readOnly = true)
    public List<CareerRoadmapDto> listRoadmaps(UUID userId) {
        List<CareerRoadmap> roadmaps = roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (roadmaps.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                CareerRoadmap rm = new CareerRoadmap();
                rm.setUser(user);
                rm.setTitle("Staff Backend & Distributed Systems Mastery (2026)");
                rm.setTargetRole("Staff Software Engineer");
                rm.setTargetSeniority("STAFF");
                rm.setTargetCompletionDate(LocalDate.now().plusMonths(3));
                rm.setWeeklyStudyHours(12);
                rm.setProgressPercentage(BigDecimal.valueOf(45.0));
                rm.setStatus("ACTIVE");
                CareerRoadmap savedRm = roadmapRepository.save(rm);

                RoadmapMilestone m1 = new RoadmapMilestone();
                m1.setRoadmap(savedRm);
                m1.setMilestoneOrder(1);
                m1.setTitle("Java Concurrency & Memory Model Deep Dive");
                m1.setDescription("Master Volatile semantics, False Sharing, StampedLock, and Virtual Thread schedulers.");
                m1.setSkillCategory("LANGUAGE");
                m1.setEstimatedHours(15);
                m1.setCompleted(true);
                m1.setCompletedAt(Instant.now().minusSeconds(86400 * 5));

                RoadmapMilestone m2 = new RoadmapMilestone();
                m2.setRoadmap(savedRm);
                m2.setMilestoneOrder(2);
                m2.setTitle("Distributed Transactions & Consensus (Saga, Paxos/Raft)");
                m2.setDescription("Design 2PC versus Saga patterns with outbox pattern and Kafka idempotency.");
                m2.setSkillCategory("ARCHITECTURE");
                m2.setEstimatedHours(20);
                m2.setCompleted(false);

                RoadmapMilestone m3 = new RoadmapMilestone();
                m3.setRoadmap(savedRm);
                m3.setMilestoneOrder(3);
                m3.setTitle("PostgreSQL Performance, MVCC, and Index Internals");
                m3.setDescription("Execution plan deep dive, vacuuming tuning, and partition strategies.");
                m3.setSkillCategory("DATABASE");
                m3.setEstimatedHours(15);
                m3.setCompleted(false);

                milestoneRepository.saveAll(List.of(m1, m2, m3));
                savedRm.getMilestones().addAll(List.of(m1, m2, m3));
                roadmaps = List.of(savedRm);
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

    @Transactional(readOnly = true)
    public List<SavedQuestionDto> listSavedQuestions(UUID userId) {
        List<SavedQuestion> questions = savedQuestionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (questions.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                SavedQuestion q1 = new SavedQuestion();
                q1.setUser(user);
                q1.setCategory("Java & Spring Boot");
                q1.setQuestionText("How does Spring's @Transactional annotation work internally via AOP proxies, and why does calling a transactional method from within the same class bypass transaction boundaries?");
                q1.setReferenceAnswer("Spring @Transactional creates a dynamic JDK or CGLIB proxy around the bean. Intra-class calls execute directly on the target instance ('this') rather than the proxy, skipping the transaction interceptor.");
                q1.setDifficulty("HARD");
                q1.setNotes("High frequency question in senior backend interviews.");
                savedQuestionRepository.save(q1);
                questions = List.of(q1);
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
