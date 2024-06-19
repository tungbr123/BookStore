package com.example.demo.model.response;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRevenueResponse {
	private Long getTotalRevenueByUser;
	private Long getTotalOrderByUser;
	private Long userid;
    private String username;
    private List<OrderitemResponse> orderItems;
}
