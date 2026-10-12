package com.carepulse.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FamilyDiscussionDto {
    private Long id;
    private Long familyGroupId;
    private Long userId;
    private String userName;
    private String userRole;
    private String message;
    private String category;
    private Long parentMessageId;
    private LocalDateTime createdAt;

    public FamilyDiscussionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFamilyGroupId() { return familyGroupId; }
    public void setFamilyGroupId(Long familyGroupId) { this.familyGroupId = familyGroupId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(Long parentMessageId) { this.parentMessageId = parentMessageId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
