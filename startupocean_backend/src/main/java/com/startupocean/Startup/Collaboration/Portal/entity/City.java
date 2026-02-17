package com.startupocean.Startup.Collaboration.Portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Long cityId;

    @Column(name = "city_name", nullable = false, unique = true)
    private String cityName;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
