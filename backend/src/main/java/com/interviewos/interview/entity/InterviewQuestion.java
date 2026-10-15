package com.interviewos.interview.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(name = "question_order", nullable = false)
    private int questionOrder;

    @Column(name = "interviewer_persona", nullable = false)
    private String interviewerPersona = "Technical Lead";

    @Column(nullable = false, length = 100)
    private String competency;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "rubric_guidelines", columnDefinition = "TEXT")
    private String rubricGuidelines;

    @Column(nullable = false, length = 50)
    private String difficulty = "MEDIUM";

    @Column(name = "source_reference")
    private String sourceReference;

    @Column(nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, ACTIVE, ANSWERED, SKIPPED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private InterviewAnswer answer;

    public InterviewQuestion() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public int getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(int questionOrder) { this.questionOrder = questionOrder; }
    public String getInterviewerPersona() { return interviewerPersona; }
    public void setInterviewerPersona(String interviewerPersona) { this.interviewerPersona = interviewerPersona; }
    public String getCompetency() { return competency; }
    public void setCompetency(String competency) { this.competency = competency; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getRubricGuidelines() { return rubricGuidelines; }
    public void setRubricGuidelines(String rubricGuidelines) { this.rubricGuidelines = rubricGuidelines; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public InterviewAnswer getAnswer() { return answer; }
    public void setAnswer(InterviewAnswer answer) { this.answer = answer; }
}
