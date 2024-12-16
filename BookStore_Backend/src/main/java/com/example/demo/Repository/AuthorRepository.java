package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Author;


public interface AuthorRepository extends JpaRepository<Author, Long>{
	Author findAuthorById(Long id);
}
