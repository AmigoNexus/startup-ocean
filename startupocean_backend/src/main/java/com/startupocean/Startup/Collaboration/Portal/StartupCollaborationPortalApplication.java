package com.startupocean.Startup.Collaboration.Portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@EnableScheduling
@SpringBootApplication
public class StartupCollaborationPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(StartupCollaborationPortalApplication.class, args);
	}

}
