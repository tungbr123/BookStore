package com.example.demo.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

	@Bean
	public Dotenv dotenv() {
		return Dotenv.configure().filename("local.env") // Thay bằng tên file nếu cần
				.load();
	}
}