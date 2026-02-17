package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {

    List<City> findByIsActiveTrue();

    boolean existsByCityNameIgnoreCase(String cityName);
}
