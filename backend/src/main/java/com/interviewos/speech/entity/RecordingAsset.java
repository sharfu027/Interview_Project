package com.interviewos.speech.entity;

import com.interviewos.interview.entity.InterviewSession;
import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recording_assets")
public class RecordingAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "media_type", nullable = false, length = 50)
    private String mediaType = "VIDEO"; // AUDIO, VIDEO

    @Column(name = "storage_key", nullable = false)
    private String storageKey;

    @Column(name = "storage_bucket", nullable = false, length = 100)
    private String storageBucket = "interviewos-recordings";

    @Column(name = "file_size_bytes", nullable = false)
    private long fileSizeBytes;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType = "video/webm";

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RecordingAsset() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }
    public String getStorageBucket() { return storageBucket; }
    public void setStorageBucket(String storageBucket) { this.storageBucket = storageBucket; }
    public long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
