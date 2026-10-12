package com.carepulse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "family_members")
public class FamilyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_group_id", nullable = false)
    private FamilyGroup familyGroup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String relationship;
    private String responsibilities;

    public FamilyMember() {}
    public FamilyMember(FamilyGroup familyGroup, User user, String relationship, String responsibilities) {
        this.familyGroup = familyGroup;
        this.user = user;
        this.relationship = relationship;
        this.responsibilities = responsibilities;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FamilyGroup getFamilyGroup() { return familyGroup; }
    public void setFamilyGroup(FamilyGroup familyGroup) { this.familyGroup = familyGroup; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }
}
