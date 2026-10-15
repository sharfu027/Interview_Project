package com.interviewos.recruiter.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.recruiter.dto.*;
import com.interviewos.recruiter.entity.*;
import com.interviewos.recruiter.repository.*;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecruiterService {

    private final RecruiterJobRepository recruiterJobRepository;
    private final RecruiterCandidateLinkRepository candidateLinkRepository;
    private final EvaluationScorecardRepository scorecardRepository;
    private final UserRepository userRepository;

    private static final UUID DEMO_ORG_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    public RecruiterService(
        RecruiterJobRepository recruiterJobRepository,
        RecruiterCandidateLinkRepository candidateLinkRepository,
        EvaluationScorecardRepository scorecardRepository,
        UserRepository userRepository
    ) {
        this.recruiterJobRepository = recruiterJobRepository;
        this.candidateLinkRepository = candidateLinkRepository;
        this.scorecardRepository = scorecardRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<RecruiterJobDto> listJobs(UUID orgId) {
        UUID organizationId = (orgId != null) ? orgId : DEMO_ORG_ID;
        return recruiterJobRepository.findByOrganizationIdOrderByCreatedAtDesc(organizationId).stream()
            .map(this::toJobDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public RecruiterJobDto createJob(UUID orgId, UUID userId, CreateRecruiterJobRequest req) {
        UUID organizationId = (orgId != null) ? orgId : DEMO_ORG_ID;
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RecruiterJob job = new RecruiterJob();
        job.setOrganizationId(organizationId);
        job.setCreatedBy(user);
        job.setTitle(req.title().trim());
        job.setDepartment(req.department());
        job.setJobFamily(req.jobFamily().toUpperCase());
        job.setSeniority(req.seniority() != null ? req.seniority().toUpperCase() : "MID");
        job.setLocation(req.location() != null ? req.location() : "Remote");
        job.setEmploymentType(req.employmentType() != null ? req.employmentType() : "FULL_TIME");
        job.setDescription(req.description().trim());
        job.setStatus("PUBLISHED");

        RecruiterJob saved = recruiterJobRepository.save(job);
        return toJobDto(saved);
    }

    @Transactional
    public List<RecruiterCandidateDto> listCandidates(UUID orgId) {
        UUID organizationId = (orgId != null) ? orgId : DEMO_ORG_ID;
        List<RecruiterCandidateLink> list = candidateLinkRepository.findByOrganizationIdOrderByCreatedAtDesc(organizationId);

        if (list.isEmpty()) {
            List<RecruiterJob> jobs = recruiterJobRepository.findByOrganizationIdOrderByCreatedAtDesc(organizationId);
            User candidate = userRepository.findByEmail("candidate@interviewos.dev").orElse(null);
            if (!jobs.isEmpty() && candidate != null) {
                RecruiterCandidateLink link = new RecruiterCandidateLink();
                link.setOrganizationId(organizationId);
                link.setJob(jobs.get(0));
                link.setCandidate(candidate);
                link.setStatus("ACTIVE");
                link.setCandidateConsentedShare(true);
                link.setRecruiterRating(BigDecimal.valueOf(4.8));
                candidateLinkRepository.save(link);
                list = List.of(link);
            }
        }

        return list.stream()
            .map(c -> new RecruiterCandidateDto(
                c.getId(),
                c.getCandidate().getId(),
                c.getCandidate().getFirstName() + " " + c.getCandidate().getLastName(),
                c.getCandidate().getEmail(),
                c.getJob().getTitle(),
                c.getStatus(),
                c.getRecruiterRating(),
                c.isCandidateConsentedShare(),
                c.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvaluationScorecardDto> listScorecards(UUID candidateLinkId) {
        List<EvaluationScorecard> cards = scorecardRepository.findByCandidateLinkId(candidateLinkId);
        if (cards.isEmpty()) {
            RecruiterCandidateLink link = candidateLinkRepository.findById(candidateLinkId).orElse(null);
            if (link != null) {
                EvaluationScorecard sc = new EvaluationScorecard();
                sc.setCandidateLink(link);
                sc.setInterviewer(link.getJob().getCreatedBy());
                sc.setRecommendation("STRONG_HIRE");
                sc.setOverallScore(BigDecimal.valueOf(9.2));
                sc.setGeneralNotes("Superb system architecture and concurrency knowledge. Candidate gave precise, structured responses with clear trade-off explanations.");
                scorecardRepository.save(sc);
                cards = List.of(sc);
            }
        }

        return cards.stream()
            .map(sc -> new EvaluationScorecardDto(
                sc.getId(),
                sc.getCandidateLink().getId(),
                sc.getCandidateLink().getCandidate().getFirstName() + " " + sc.getCandidateLink().getCandidate().getLastName(),
                sc.getInterviewer().getFirstName() + " " + sc.getInterviewer().getLastName(),
                sc.getRecommendation(),
                sc.getOverallScore(),
                sc.getGeneralNotes(),
                sc.getSubmittedAt()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public EvaluationScorecardDto submitScorecard(UUID candidateLinkId, UUID interviewerId, SubmitScorecardRequest req) {
        RecruiterCandidateLink link = candidateLinkRepository.findById(candidateLinkId)
            .orElseThrow(() -> new ResourceNotFoundException("Candidate link not found"));

        User interviewer = userRepository.findById(interviewerId)
            .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found"));

        EvaluationScorecard sc = new EvaluationScorecard();
        sc.setCandidateLink(link);
        sc.setInterviewer(interviewer);
        sc.setRecommendation(req.recommendation().toUpperCase());
        sc.setOverallScore(req.overallScore());
        sc.setGeneralNotes(req.generalNotes());

        EvaluationScorecard saved = scorecardRepository.save(sc);

        return new EvaluationScorecardDto(
            saved.getId(),
            saved.getCandidateLink().getId(),
            saved.getCandidateLink().getCandidate().getFirstName() + " " + saved.getCandidateLink().getCandidate().getLastName(),
            saved.getInterviewer().getFirstName() + " " + saved.getInterviewer().getLastName(),
            saved.getRecommendation(),
            saved.getOverallScore(),
            saved.getGeneralNotes(),
            saved.getSubmittedAt()
        );
    }

    private RecruiterJobDto toJobDto(RecruiterJob j) {
        return new RecruiterJobDto(
            j.getId(),
            j.getOrganizationId(),
            j.getTitle(),
            j.getDepartment(),
            j.getJobFamily(),
            j.getSeniority(),
            j.getLocation(),
            j.getEmploymentType(),
            j.getDescription(),
            j.getStatus(),
            j.getCreatedAt()
        );
    }
}
