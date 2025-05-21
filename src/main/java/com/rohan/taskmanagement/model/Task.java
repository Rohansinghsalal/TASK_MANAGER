package com.rohan.taskmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotEmpty(message = "Task title is required")
    @Column(nullable = false)
    public String title;

    @Column(length = 1000)
    public String description;

    @Column(name = "due_date")
    public LocalDateTime dueDate;

    @Column(nullable = false)
    public String status;

    @Column(length = 500)
    public String remarks;

    @Column(name = "created_on", nullable = false)
    public LocalDateTime createdOn;

    @Column(name = "last_updated_on", nullable = false)
    public LocalDateTime lastUpdatedOn;

    @Column(name = "created_by", nullable = false)
    public String createdBy;

    @Column(name = "last_updated_by", nullable = false)
    public String lastUpdatedBy;
    
    public Task() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public LocalDateTime getLastUpdatedOn() {
        return lastUpdatedOn;
    }

    public void setLastUpdatedOn(LocalDateTime lastUpdatedOn) {
        this.lastUpdatedOn = lastUpdatedOn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    public void setLastUpdatedBy(String lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        
        if (createdOn == null) {
            createdOn = now;
        }
        
        if (lastUpdatedOn == null) {
            lastUpdatedOn = now;
        }
        
        if (status == null || status.isEmpty()) {
            status = "TODO";
        }
        
        if (createdBy == null) {
            createdBy = "system";
        }
        
        if (lastUpdatedBy == null) {
            lastUpdatedBy = "system";
        }
    }

    @PreUpdate
    public void preUpdate() {
        lastUpdatedOn = LocalDateTime.now();
        
        if (lastUpdatedBy == null) {
            lastUpdatedBy = "system";
        }
    }
}