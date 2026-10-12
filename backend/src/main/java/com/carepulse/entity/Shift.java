package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    private String shiftType;
    private String timeRange;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public Shift() {}
    public Shift(User caregiver, String shiftType, String timeRange, LocalDateTime startTime, LocalDateTime endTime, String status) {
        this.caregiver = caregiver;
        this.shiftType = shiftType;
        this.timeRange = timeRange;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCaregiver() { return caregiver; }
    public void setCaregiver(User caregiver) { this.caregiver = caregiver; }
    public String getShiftType() { return shiftType; }
    public void setShiftType(String shiftType) { this.shiftType = shiftType; }
    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
