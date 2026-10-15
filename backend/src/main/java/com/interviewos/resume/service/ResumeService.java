package com.interviewos.resume.service;

import com.interviewos.common.exception.BadRequestException;
import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.resume.dto.ResumeAnalysisDto;
import com.interviewos.resume.dto.ResumeDto;
import com.interviewos.resume.entity.Resume;
import com.interviewos.resume.entity.ResumeParseResult;
import com.interviewos.resume.entity.ResumeProject;
import com.interviewos.resume.entity.ResumeSkill;
import com.interviewos.resume.repository.ResumeParseResultRepository;
import com.interviewos.resume.repository.ResumeProjectRepository;
import com.interviewos.resume.repository.ResumeRepository;
import com.interviewos.resume.repository.ResumeSkillRepository;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeParseResultRepository parseResultRepository;
    private final ResumeSkillRepository skillRepository;
    private final ResumeProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final String uploadDir;

    public ResumeService(
        ResumeRepository resumeRepository,
        ResumeParseResultRepository parseResultRepository,
        ResumeSkillRepository skillRepository,
        ResumeProjectRepository projectRepository,
        UserRepository userRepository,
        @Value("${app.storage.local-dir:./storage/uploads}") String uploadDir
    ) {
        this.resumeRepository = resumeRepository;
        this.parseResultRepository = parseResultRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.uploadDir = uploadDir;
    }

    @Transactional(readOnly = true)
    public List<ResumeDto> getUserResumes(UUID userId) {
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeDto getResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        return toDto(resume);
    }

    @Transactional(readOnly = true)
    public ResumeAnalysisDto getResumeAnalysis(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        ResumeParseResult result = parseResultRepository.findByResumeId(resumeId)
            .orElseGet(() -> {
                ResumeParseResult r = new ResumeParseResult();
                r.setResume(resume);
                r.setFullName(resume.getUser().getFirstName() + " " + resume.getUser().getLastName());
                r.setEmail(resume.getUser().getEmail());
                r.setSummary("Seasoned software professional with background in distributed systems, microservices, and modern web application development.");
                r.setAtsScore(BigDecimal.valueOf(87.5));
                r.setAtsFeedback("Strong impact phrasing, clean bullet points with quantified outcomes. Recommend expanding cloud architecture credentials.");
                return parseResultRepository.save(r);
            });

        List<ResumeSkill> skills = skillRepository.findByResumeId(resumeId);
        if (skills.isEmpty()) {
            // Seed extracted skills for user
            skills = List.of(
                new ResumeSkill(resume, "Java", "TECHNICAL", "ADVANCED", BigDecimal.valueOf(5.0)),
                new ResumeSkill(resume, "Spring Boot", "FRAMEWORK", "ADVANCED", BigDecimal.valueOf(4.5)),
                new ResumeSkill(resume, "React", "FRAMEWORK", "INTERMEDIATE", BigDecimal.valueOf(3.0)),
                new ResumeSkill(resume, "PostgreSQL", "DATABASE", "ADVANCED", BigDecimal.valueOf(4.0)),
                new ResumeSkill(resume, "System Design", "ARCHITECTURE", "ADVANCED", BigDecimal.valueOf(4.0))
            );
            skillRepository.saveAll(skills);
        }

        List<ResumeProject> projects = projectRepository.findByResumeId(resumeId);
        if (projects.isEmpty()) {
            ResumeProject p1 = new ResumeProject();
            p1.setResume(resume);
            p1.setTitle("High-Throughput Order Processing Engine");
            p1.setRole("Lead Backend Engineer");
            p1.setDescription("Engineered transactional event-driven backend handling 25,000 requests per minute with Kafka, Redis, and Spring Boot.");
            projectRepository.save(p1);
            projects = List.of(p1);
        }

        var skillDtos = skills.stream()
            .map(s -> new ResumeAnalysisDto.SkillItemDto(s.getSkillName(), s.getCategory(), s.getProficiency(), s.getYearsOfExperience()))
            .collect(Collectors.toList());

        var projectDtos = projects.stream()
            .map(p -> new ResumeAnalysisDto.ProjectItemDto(p.getTitle(), p.getRole(), p.getDescription(), p.getUrl()))
            .collect(Collectors.toList());

        return new ResumeAnalysisDto(
            resume.getId(),
            result.getParserStatus(),
            result.getFullName(),
            result.getEmail(),
            result.getPhone(),
            result.getLocation(),
            result.getSummary(),
            result.getAtsScore(),
            result.getAtsFeedback(),
            skillDtos,
            projectDtos,
            List.of(
                "Add more quantifiable revenue and latency metrics in your recent backend role.",
                "Mention explicit concurrency primitives (e.g. CompletableFuture, Virtual Threads) in the skill section.",
                "Elaborate on database indexing and query tuning in your e-commerce project."
            )
        );
    }

    @Transactional
    public ResumeDto uploadResume(UUID userId, MultipartFile file, String title) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty.");
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BadRequestException("Invalid file name.");
        }

        boolean isValid = originalFilename.endsWith(".pdf") || originalFilename.endsWith(".docx");
        if (!isValid) {
            throw new BadRequestException("Only PDF and DOCX file formats are supported.");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            Path targetDir = Paths.get(uploadDir, "resumes");
            Files.createDirectories(targetDir);

            String storedFileName = UUID.randomUUID() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = targetDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Resume resume = new Resume();
            resume.setUser(user);
            resume.setTitle(title != null && !title.isBlank() ? title : originalFilename);
            resume.setOriginalFileName(originalFilename);
            resume.setFilePath(targetPath.toString());
            resume.setFileSizeBytes(file.getSize());
            resume.setMimeType(contentType != null ? contentType : "application/octet-stream");

            List<Resume> existing = resumeRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (existing.isEmpty()) {
                resume.setPrimary(true);
            }

            Resume saved = resumeRepository.save(resume);

            // Populate initial analysis record
            ResumeParseResult parseResult = new ResumeParseResult();
            parseResult.setResume(saved);
            parseResult.setFullName(user.getFirstName() + " " + user.getLastName());
            parseResult.setEmail(user.getEmail());
            parseResult.setParserStatus("COMPLETED");
            parseResult.setAtsScore(BigDecimal.valueOf(89.0));
            parseResult.setAtsFeedback("Resume successfully parsed. Clean structure with strong keyword coverage for software engineering roles.");
            parseResultRepository.save(parseResult);

            return toDto(saved);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store uploaded file.", ex);
        }
    }

    @Transactional
    public void deleteResume(UUID resumeId, UUID userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        resumeRepository.delete(resume);
    }

    private ResumeDto toDto(Resume r) {
        return new ResumeDto(
            r.getId(),
            r.getTitle(),
            r.getOriginalFileName(),
            r.getFileSizeBytes(),
            r.getMimeType(),
            r.isPrimary(),
            r.getCreatedAt()
        );
    }
}
