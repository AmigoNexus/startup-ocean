package com.startupocean.Startup.Collaboration.Portal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_id")
    private Long enquiryId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnquiryStatus status = EnquiryStatus.NEW;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void softDelete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
    }

    public void restore() {
        this.isActive = true;
        this.deletedAt = null;
    }

    public enum EnquiryStatus {
        NEW,
        IN_PROGRESS,
        RESOLVED,
        CLOSED
    }
}