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
public class RevenueResponse {
	private Long getTotalRevenue;
	private Long getAllOrderQuantity;
    private Long getRevenueByDelivering;
    private Long getRevenueByPending;
    private Long getRevenueByCanceled;
    private Long getRevenueByCompleted;
	private List<UserRevenueResponse> getTop3Users;
    private List<ProductRevenueResponse> getTop3Product; 
    private List<RevenueByMonthResponse> getMonthlyRevenue;
}
