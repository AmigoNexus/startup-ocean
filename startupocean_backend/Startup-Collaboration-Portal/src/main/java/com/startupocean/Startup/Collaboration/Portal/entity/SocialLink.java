package com.startupocean.Startup.Collaboration.Portal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_links")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_link_id")
    private Long socialLinkId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(length = 500)
    private String website;

    @Column(length = 500)
    private String linkedin;

    @Column(length = 500)
    private String facebook;

    @Column(length = 500)
    private String instagram;

    @Column(length = 500)
    private String twitter;

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
}