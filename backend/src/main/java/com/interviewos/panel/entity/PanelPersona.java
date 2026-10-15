package com.interviewos.panel.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "panel_personas")
public class PanelPersona {

    @Id
    @Column(length = 50)
    private String id; // HR, TECH_LEAD, HIRING_MGR, ARCHITECT

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "role_title", nullable = false, length = 100)
    private String roleTitle;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "questioning_style", nullable = false, columnDefinition = "TEXT")
    private String questioningStyle;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public PanelPersona() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getQuestioningStyle() { return questioningStyle; }
    public void setQuestioningStyle(String questioningStyle) { this.questioningStyle = questioningStyle; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
