package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findByCompany(Company company);

}
