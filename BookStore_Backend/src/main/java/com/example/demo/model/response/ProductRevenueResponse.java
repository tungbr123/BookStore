package com.example.demo.model.response;

import java.util.List;

import com.example.demo.Entity.Product;
import com.example.demo.Entity._User;

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
public class ProductRevenueResponse {
	private Long getTotalCount;
	private Long productid;
    private String productname;
}
