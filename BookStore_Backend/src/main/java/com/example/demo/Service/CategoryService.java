package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Category;

@Service
public interface CategoryService {
	List<Category> getAllCategories();
}
