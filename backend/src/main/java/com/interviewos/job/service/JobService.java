package com.interviewos.job.service;

import com.interviewos.common.PagedResponse;
import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.job.dto.ApplicationDto;
import com.interviewos.job.dto.CompanyDto;
import com.interviewos.job.dto.CreateApplicationRequest;
import com.interviewos.job.dto.JobPostingDto;
import com.interviewos.job.entity.Application;
import com.interviewos.job.entity.Company;
import com.interviewos.job.entity.JobPosting;
import com.interviewos.job.repository.ApplicationRepository;
import com.interviewos.job.repository.CompanyRepository;
import com.interviewos.job.repository.JobPostingRepository;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobPostingRepository jobPostingRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobService(
        JobPostingRepository jobPostingRepository,
        CompanyRepository companyRepository,
        ApplicationRepository applicationRepository,
        UserRepository userRepository
    ) {
        this.jobPostingRepository = jobPostingRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobPostingDto> listActiveJobs(int page, int size) {
        Page<JobPosting> jobPage = jobPostingRepository.findByIsActiveTrue(PageRequest.of(page, size));
        if (jobPage.isEmpty() && page == 0) {
            seedSampleJobsIfEmpty();
            jobPage = jobPostingRepository.findByIsActiveTrue(PageRequest.of(page, size));
        }

        Page<JobPostingDto> dtoPage = jobPage.map(this::toJobDto);
        return PagedResponse.of(dtoPage);
    }

    @Transactional(readOnly = true)
    public JobPostingDto getJobById(UUID jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));
        return toJobDto(job);
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyPrep(String slug) {
        Company company = companyRepository.findBySlug(slug)
            .orElseGet(() -> {
                Company c = new Company();
                c.setName("Stripe");
                c.setSlug("stripe");
                c.setWebsite("https://stripe.com");
                c.setIndustry("Fintech / Payment Infrastructure");
                c.setHeadquarters("San Francisco & Dublin");
                c.setOverview("Global financial infrastructure platform known for high engineering standards, clean APIs, and rigorous system design interviews.");
                c.setInterviewProcessNotes("Standard rounds: 1) Recruiter Screen (30m), 2) Technical Screen (Pair programming, 60m), 3) System Architecture & Scale (60m), 4) Integration & API Design (60m), 5) Hiring Manager & Culture (45m). Emphasize idempotency and payment consistency.");
                return companyRepository.save(c);
            });

        return new CompanyDto(
            company.getId(),
            company.getName(),
            company.getSlug(),
            company.getLogoUrl(),
            company.getWebsite(),
            company.getIndustry(),
            company.getHeadquarters(),
            company.getOverview(),
            company.getInterviewProcessNotes()
        );
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> listApplications(UUID userId) {
        List<Application> apps = applicationRepository.findByUserIdOrderByAppliedDateDesc(userId);
        if (apps.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                Application demoApp = new Application();
                demoApp.setUser(user);
                demoApp.setCompanyName("Google");
                demoApp.setJobTitle("Staff Software Engineer, Cloud Core");
                demoApp.setStatus("INTERVIEWING");
                demoApp.setCurrentStage("Technical Onsite Round 2");
                demoApp.setAppliedDate(LocalDate.now().minusDays(14));
                demoApp.setNotes("Passed recruiter screen and phone tech screen. Prepare distributed caching, Paxos/Raft consensus, and Java memory tuning.");
                applicationRepository.save(demoApp);
                apps = List.of(demoApp);
            }
        }
        return apps.stream().map(this::toAppDto).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto createApplication(UUID userId, CreateApplicationRequest req) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Application app = new Application();
        app.setUser(user);
        app.setCompanyName(req.companyName());
        app.setJobTitle(req.jobTitle());
        app.setStatus(req.status() != null ? req.status() : "APPLIED");
        app.setCurrentStage(req.currentStage() != null ? req.currentStage() : "Application Submitted");
        app.setAppliedDate(req.appliedDate() != null ? req.appliedDate() : LocalDate.now());
        app.setSalaryOffered(req.salaryOffered());
        app.setContactPerson(req.contactPerson());
        app.setContactEmail(req.contactEmail());
        app.setNotes(req.notes());

        Application saved = applicationRepository.save(app);
        return toAppDto(saved);
    }

    @Transactional
    public ApplicationDto updateApplication(UUID applicationId, UUID userId, String status, String currentStage) {
        Application app = applicationRepository.findByIdAndUserId(applicationId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (status != null) app.setStatus(status);
        if (currentStage != null) app.setCurrentStage(currentStage);

        Application saved = applicationRepository.save(app);
        return toAppDto(saved);
    }

    @Transactional
    public void deleteApplication(UUID applicationId, UUID userId) {
        Application app = applicationRepository.findByIdAndUserId(applicationId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        applicationRepository.delete(app);
    }

    private JobPostingDto toJobDto(JobPosting j) {
        return new JobPostingDto(
            j.getId(),
            j.getCompanyName(),
            j.getTitle(),
            j.getJobFamily(),
            j.getSeniority(),
            j.getLocation(),
            j.getEmploymentType(),
            j.getRemotePolicy(),
            j.getRawDescription(),
            j.getSalaryMin(),
            j.getSalaryMax(),
            j.getCurrency(),
            j.getExternalUrl()
        );
    }

    private ApplicationDto toAppDto(Application a) {
        return new ApplicationDto(
            a.getId(),
            a.getCompanyName(),
            a.getJobTitle(),
            a.getStatus(),
            a.getCurrentStage(),
            a.getAppliedDate(),
            a.getSalaryOffered(),
            a.getContactPerson(),
            a.getContactEmail(),
            a.getNotes()
        );
    }

    private void seedSampleJobsIfEmpty() {
        JobPosting j1 = new JobPosting();
        j1.setCompanyName("Stripe");
        j1.setTitle("Staff Infrastructure Engineer (Java/Distributed Systems)");
        j1.setJobFamily("BACKEND");
        j1.setSeniority("STAFF");
        j1.setLocation("San Francisco, CA / Remote");
        j1.setEmploymentType("FULL_TIME");
        j1.setRemotePolicy("REMOTE");
        j1.setSalaryMin(BigDecimal.valueOf(220000));
        j1.setSalaryMax(BigDecimal.valueOf(310000));
        j1.setRawDescription("Architect mission-critical payment settlement pipelines handling billions of dollars daily with 99.999% availability.");

        JobPosting j2 = new JobPosting();
        j2.setCompanyName("Netflix");
        j2.setTitle("Senior Full-Stack Engineer (React 19 & Spring Boot)");
        j2.setJobFamily("FULLSTACK");
        j2.setSeniority("SENIOR");
        j2.setLocation("Los Gatos, CA / Remote");
        j2.setEmploymentType("FULL_TIME");
        j2.setRemotePolicy("HYBRID");
        j2.setSalaryMin(BigDecimal.valueOf(250000));
        j2.setSalaryMax(BigDecimal.valueOf(350000));
        j2.setRawDescription("Lead developer productivity and studio orchestration tools with low latency interactive web consoles and robust microservices.");

        jobPostingRepository.saveAll(List.of(j1, j2));
    }
}
