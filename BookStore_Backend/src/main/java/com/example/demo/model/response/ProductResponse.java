package com.example.demo.model.response;

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
	private String category_name;
	private float rating;
	private int totalPages;
}
