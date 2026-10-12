package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "family_discussions")
public class FamilyDiscussion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_group_id", nullable = false)
    private FamilyGroup familyGroup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String category = "UPDATE";
    private Long parentMessageId;
    private LocalDateTime createdAt = LocalDateTime.now();

    public FamilyDiscussion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FamilyGroup getFamilyGroup() { return familyGroup; }
    public void setFamilyGroup(FamilyGroup familyGroup) { this.familyGroup = familyGroup; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(Long parentMessageId) { this.parentMessageId = parentMessageId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
