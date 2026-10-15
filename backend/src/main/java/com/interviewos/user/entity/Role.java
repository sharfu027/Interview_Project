package com.interviewos.user.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_system", nullable = false)
    private boolean isSystem = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Role() {}

    public Role(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isSystem() { return isSystem; }
    public void setSystem(boolean system) { isSystem = system; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
