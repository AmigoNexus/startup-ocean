package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final CompanyRepository companyRepository;

    @PostMapping("/logo/{companyId}")
    public ResponseEntity<?> uploadLogo(
            @PathVariable Long companyId,
            @RequestParam("file") MultipartFile file) {

        log.info("Logo upload request received for companyId={}", companyId);

        try {

            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> {
                        log.error("Company not found for id={}", companyId);
                        return new RuntimeException("Company not found");
                    });

            if (file.isEmpty()) {
                log.warn("Uploaded file is empty for companyId={}", companyId);
                return ResponseEntity.badRequest().body("File is empty");
            }

            log.info("Uploading logo for company: {} (id={}) size={} bytes",
                    company.getCompanyName(),
                    companyId,
                    file.getSize());

            company.setLogo(file.getBytes());
            companyRepository.save(company);

            log.info("Logo uploaded successfully for companyId={}", companyId);

            return ResponseEntity.ok("Logo uploaded successfully");

        } catch (Exception e) {

            log.error("Logo upload failed for companyId={} error={}", companyId, e.getMessage(), e);

            return ResponseEntity.status(500).body("Upload failed");
        }
    }

    @GetMapping("/logo/{companyId}")
    public ResponseEntity<byte[]> getLogo(@PathVariable Long companyId) {

        log.info("Logo fetch request received for companyId={}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> {
                    log.error("Company not found while fetching logo id={}", companyId);
                    return new RuntimeException("Company not found");
                });

        byte[] logo = company.getLogo();

        if (logo == null) {
            log.warn("Logo not found in DB for companyId={}", companyId);
            return ResponseEntity.notFound().build();
        }

        log.info("Logo fetched successfully for companyId={} size={} bytes",
                companyId,
                logo.length);

        return ResponseEntity.ok()
                .header("Content-Type", "image/*")
                .body(logo);
    }
}


















































//package com.startupocean.Startup.Collaboration.Portal.controller;
//
//import com.startupocean.Startup.Collaboration.Portal.entity.Company;
//import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//
//@RestController
//@RequestMapping("/upload")
//@RequiredArgsConstructor
//public class FileUploadController {
//
//    private final CompanyRepository companyRepository;
//
//    @PostMapping("/logo/{companyId}")
//    public ResponseEntity<?> uploadLogo(
//            @PathVariable Long companyId,
//            @RequestParam("file") MultipartFile file) {
//
//        try {
//
//            Company company = companyRepository.findById(companyId)
//                    .orElseThrow(() -> new RuntimeException("Company not found"));
//
//            if (file.isEmpty()) {
//                return ResponseEntity.badRequest().body("File is empty");
//            }
//
//            company.setLogo(file.getBytes());
//            companyRepository.save(company);
//
//            return ResponseEntity.ok("Logo uploaded successfully");
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Upload failed");
//        }
//    }
//
////    @Transactional(readOnly = true)
////    @GetMapping("/logo/{companyId}")
////    public ResponseEntity<byte[]> getLogo(@PathVariable Long companyId) {
////
////        Company company = companyRepository.findById(companyId)
////                .orElseThrow(() -> new RuntimeException("Company not found"));
////
////        byte[] logo = company.getLogo();
////
////        if (logo == null) {
////            return ResponseEntity.notFound().build();
////        }
////
////        return ResponseEntity.ok()
////                .header("Content-Type", "image/jpeg")
////                .body(logo);
////    }
//@GetMapping("/logo/{companyId}")
//public ResponseEntity<byte[]> getLogo(@PathVariable Long companyId) {
//
//    Company company = companyRepository.findById(companyId)
//            .orElseThrow(() -> new RuntimeException("Company not found"));
//
//    byte[] logo = company.getLogo();
//
//    if (logo == null) {
//        return ResponseEntity.notFound().build();
//    }
//
//    return ResponseEntity.ok()
//            .header("Content-Type", "image/*")
//            .body(logo);
//}
//}
