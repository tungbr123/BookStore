package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.demo.Repository")
@ComponentScan(basePackages = "com.example.demo")
public class BookStore1Application {
	public static void main(String[] args) {
		SpringApplication.run(BookStore1Application.class, args);
	}
} 
 


  