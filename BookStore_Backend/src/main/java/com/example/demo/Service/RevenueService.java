package com.example.demo.Service;



import java.time.LocalDate;

import org.springframework.stereotype.Service;


import com.example.demo.model.response.ApiResponse;

@Service
public interface RevenueService {
	ApiResponse<Object> getRevenue();
	ApiResponse<Object> getTop3Users();
	ApiResponse<Object> getTop3Product();
	ApiResponse<Object> getMonthlyRevenue(String startDate, String endDate);
}
