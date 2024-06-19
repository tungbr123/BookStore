package com.example.demo.model.response;

import java.util.List;

import com.example.demo.Entity.Product;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Builder
public class WishlistResponse {
	private List<Product> products;
}
