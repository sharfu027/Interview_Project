package com.interviewos.speech.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.interview.entity.InterviewQuestion;
import com.interviewos.interview.entity.InterviewSession;
import com.interviewos.interview.repository.InterviewQuestionRepository;
import com.interviewos.interview.repository.InterviewSessionRepository;
import com.interviewos.speech.dto.RecordingAssetDto;
import com.interviewos.speech.dto.SaveSpeechMetricRequest;
import com.interviewos.speech.dto.SpeechMetricDto;
import com.interviewos.speech.entity.RecordingAsset;
import com.interviewos.speech.entity.SpeechMetric;
import com.interviewos.speech.repository.RecordingAssetRepository;
import com.interviewos.speech.repository.SpeechMetricsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SpeechService {

    private final SpeechMetricsRepository speechMetricsRepository;
    private final RecordingAssetRepository recordingAssetRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public SpeechService(
        SpeechMetricsRepository speechMetricsRepository,
        RecordingAssetRepository recordingAssetRepository,
        InterviewSessionRepository interviewSessionRepository,
        InterviewQuestionRepository interviewQuestionRepository
    ) {
        this.speechMetricsRepository = speechMetricsRepository;
        this.recordingAssetRepository = recordingAssetRepository;
        this.interviewSessionRepository = interviewSessionRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
    }

    @Transactional
    public SpeechMetricDto recordSpeechMetric(UUID sessionId, UUID userId, SaveSpeechMetricRequest req) {
        InterviewSession session = interviewSessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        InterviewQuestion question = null;
        if (req.questionId() != null) {
            question = interviewQuestionRepository.findById(req.questionId()).orElse(null);
        }

        SpeechMetric sm = new SpeechMetric();
        sm.setSession(session);
        sm.setQuestion(question);
        sm.setWordsPerMinute(req.wordsPerMinute() != null ? req.wordsPerMinute() : BigDecimal.valueOf(130.0));
        sm.setTotalWords(req.totalWords());
        sm.setFillerWordCount(req.fillerWordCount());
        sm.setFillerWordsBreakdown(req.fillerWordsBreakdownJson() != null ? req.fillerWordsBreakdownJson() : "{}");
        sm.setPauseCount(req.pauseCount());
        sm.setLongPauseCount(req.longPauseCount());
        sm.setSpeakingDurationSeconds(req.speakingDurationSeconds() != null ? req.speakingDurationSeconds() : BigDecimal.ZERO);
        sm.setClarityScore(req.clarityScore() != null ? req.clarityScore() : BigDecimal.valueOf(8.5));
        sm.setStructureQuality(req.structureQuality() != null ? req.structureQuality() : "GOOD");
        sm.setFeedbackNotes(req.feedbackNotes());

        SpeechMetric saved = speechMetricsRepository.save(sm);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SpeechMetricDto> getSessionMetrics(UUID sessionId, UUID userId) {
        interviewSessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        return speechMetricsRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecordingAssetDto> listRecordings(UUID userId) {
        return recordingAssetRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId).stream()
            .map(r -> new RecordingAssetDto(
                r.getId(),
                r.getSession().getId(),
                r.getMediaType(),
                r.getStorageKey(),
                r.getFileSizeBytes(),
                r.getDurationSeconds(),
                r.getMimeType(),
                r.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRecording(UUID recordingId, UUID userId) {
        RecordingAsset asset = recordingAssetRepository.findByIdAndUserId(recordingId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Recording asset not found"));
        asset.setDeleted(true);
        recordingAssetRepository.save(asset);
    }

    private SpeechMetricDto toDto(SpeechMetric m) {
        return new SpeechMetricDto(
            m.getId(),
            m.getSession().getId(),
            m.getWordsPerMinute(),
            m.getTotalWords(),
            m.getFillerWordCount(),
            m.getPauseCount(),
            m.getLongPauseCount(),
            m.getSpeakingDurationSeconds(),
            m.getClarityScore(),
            m.getStructureQuality(),
            m.getFeedbackNotes(),
            m.getCreatedAt()
        );
    }
}
