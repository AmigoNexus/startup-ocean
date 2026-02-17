package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CityController {

    private final CityService cityService;

    // add city
    @PostMapping
    public ResponseEntity<ApiResponse> addCity(@RequestParam String cityName) {
        return ResponseEntity.ok(cityService.addCity(cityName));
    }

    // get all cities
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    // delete city
    @DeleteMapping("/{cityId}")
    public ResponseEntity<ApiResponse> deleteCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(cityService.deleteCity(cityId));
    }
}
