package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Collaboration;
import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRepository extends JpaRepository<Collaboration, Long> {
    List<Collaboration> findByRequesterCompanyAndIsActiveTrue(Company company);
    List<Collaboration> findByTargetCompanyAndIsActiveTrue(Company company);
    List<Collaboration> findByRequesterCompanyOrTargetCompanyAndIsActiveTrue(Company requesterCompany, Company targetCompany);
}