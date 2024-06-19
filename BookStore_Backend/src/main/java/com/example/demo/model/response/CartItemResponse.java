package com.example.demo.model.response;

import java.util.List;
import java.util.Optional;

import com.example.demo.Entity.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartItemResponse {
	private Long cart_itemid;
	private Long productid;
	private String product_name;
	private String descripttion;
	private int price;
	private int promotional_price;
	private int quantity;
	private int sold;
	private String image;
	private float rating;
	private int count;
}
