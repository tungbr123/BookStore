package com.example.demo.model.response;

import java.util.List;

import com.example.demo.Entity.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
	private Long id;	
	private String name;
	private String description;
	private int price;
	private int promotional_price;
	private int quantity;
	private int sold;
	private String image;
	private List<Category> list_category;
	private float rating;
	private String translator;
	private String supplier;
	private String publisher;
	private int published_date;
	private int pages;
	private int weight;
	private List<String> author_name;
	private int totalPages;
}
