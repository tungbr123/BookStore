package com.example.demo.model.request.Orders;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderRequest {
	private Long userid;
	private Long phone;
	private String address;
	private Long money_from_user;
	private String email;
	private String name;
}
