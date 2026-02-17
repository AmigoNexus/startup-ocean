package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CompanyRepository companyRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Company company = companyRepository
                .findByEmailAndIsActiveTrue(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Company not found"));

        return new org.springframework.security.core.userdetails.User(
                company.getEmail(),
                "N/A",
                true,
                true,
                true,
                true,
                getAuthorities()
        );
    }


    private Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(
                new SimpleGrantedAuthority("ROLE_USER")
        );
    }
}