package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByIsActiveTrue();

    Optional<Company> findByEmailAndIsActiveTrue(String email);

    @Query("""
    SELECT DISTINCT c FROM Company c
    LEFT JOIN c.services s
    WHERE c.isActive = true
    AND (
        LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    """)
    List<Company> searchCompanies(@Param("keyword") String keyword);

    @Query("""
    SELECT DISTINCT c
    FROM Company c
    JOIN c.services s
    JOIN s.offerings o
    WHERE c.isActive = true
    AND o.isActive = true
    AND LOWER(o.offeringName) LIKE LOWER(CONCAT('%', :offering, '%'))
    """)
        List<Company> searchByOffering(@Param("offering") String offering);

    Optional<Company> findByCompanyIdAndIsActiveTrue(Long companyId);
}
