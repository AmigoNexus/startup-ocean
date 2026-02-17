package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.City;
import com.startupocean.Startup.Collaboration.Portal.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;

    @Transactional
    public ApiResponse addCity(String cityName) {

        if (cityRepository.existsByCityNameIgnoreCase(cityName)) {
            return new ApiResponse(false, "City already exists", null);
        }

        City city = new City();
        city.setCityName(cityName);

        cityRepository.save(city);

        return new ApiResponse(true, "City added successfully", city);
    }

    public ApiResponse getAllCities() {
        List<City> cities = cityRepository.findByIsActiveTrue();
        return new ApiResponse(true, "Cities retrieved successfully", cities);
    }

    @Transactional
    public ApiResponse deleteCity(Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("City not found"));

        city.setIsActive(false);
        cityRepository.save(city);

        return new ApiResponse(true, "City deleted", null);
    }
}
