package com.prince.collab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CollabApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollabApplication.class, args);
	}

}
