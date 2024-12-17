package com.example.demo.ServiceImpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Orderitem;
import com.example.demo.Entity.Orders;
import com.example.demo.Entity.Product;
import com.example.demo.Entity._User;
import com.example.demo.Repository.OrderitemRepository;
import com.example.demo.Repository.OrdersRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.RevenueService;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.OrderitemResponse;
import com.example.demo.model.response.ProductRevenueResponse;
import com.example.demo.model.response.RevenueByMonthResponse;
import com.example.demo.model.response.RevenueResponse;
import com.example.demo.model.response.UserRevenueResponse;

@Service
public class RevenueServiceImpl implements RevenueService {
	@Autowired
	private OrdersRepository ordersRepository;
	@Autowired
	private OrderitemRepository orderitemRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;

	@Override
	public ApiResponse<Object> getRevenue() {
		Long totalRevenue = ordersRepository.findTotalRevenue();
		Long totalOrders = ordersRepository.countTotalOrders();
		Long totalOrdersByPending = ordersRepository.countTotalOrdersByPending();
		Long totalOrdersByDelivering = ordersRepository.countTotalOrdersByDelivering();
		Long totalOrdersByCompleted = ordersRepository.countTotalOrdersByCompleted();
		Long totalOrdersByCanceled = ordersRepository.countTotalOrdersByCanceled();

		Long revenueByDelivering = ordersRepository.findRevenueByDelivering();
		Long revenueByPending = ordersRepository.findRevenueByPending();
		Long revenueByCanceled = ordersRepository.findRevenueByCanceled();
		Long revenueByCompleted = ordersRepository.findRevenueByCompleted();
		
		
		
		
		List<Object[]> topUserResults = ordersRepository.findTopUsersWithOrderCountAndRevenue();
		List<UserRevenueResponse> topUsers = new ArrayList<>();
		for (Object[] result : topUserResults) {
			Long userId = ((Number) result[0]).longValue(); // Convert to Long
			Long totalOrderByUser = ((Number) result[1]).longValue(); // Convert to Long
			Long totalRevenueByUser = ((Number) result[2]).longValue(); // Convert to Long
			UserRevenueResponse userRevenueResponse = UserRevenueResponse.builder().userid(userId)
					.username(getUserNameById(userId)).getTotalOrderByUser(totalOrderByUser)
					.getTotalRevenueByUser(totalRevenueByUser).build();
			topUsers.add(userRevenueResponse);
		}

		List<Object[]> topProductResults = orderitemRepository.findTopProducts();
		List<ProductRevenueResponse> topProducts = new ArrayList<>();
		for (Object[] result : topProductResults) {
			Long productId = ((Number) result[0]).longValue(); // Convert to Long
			Long totalCount = ((Number) result[1]).longValue(); // Convert to Long
			ProductRevenueResponse productRevenueResponse = ProductRevenueResponse.builder().productid(productId)
					.productname(getProductNameById(productId)).getTotalCount(totalCount).build();
			topProducts.add(productRevenueResponse);
		}
		String startDate="";
		String endDate="";
		List<Object[]> monthlyRevenueResults = ordersRepository.findMonthlyRevenue(startDate,endDate );
		List<RevenueByMonthResponse> monthlyRevenue = new ArrayList<>();
		for (Object[] result : monthlyRevenueResults) {
			String month = (String) result[0];
			Long revenue = ((Number) result[1]).longValue();
			RevenueByMonthResponse revenueByMonthResponse = RevenueByMonthResponse.builder().month(month)
					.revenue(revenue).build();
			monthlyRevenue.add(revenueByMonthResponse);
		}
		RevenueResponse revenueResponse = RevenueResponse.builder().getTotalRevenue(totalRevenue)
				.getAllOrderQuantity(totalOrders).getAllOrderQuantityByPending(totalOrdersByPending)
				.getAllOrderQuantityByDelivering(totalOrdersByDelivering).getAllOrderQuantityByCompleted(totalOrdersByCompleted)
				.getAllOrderQuantityByCanceled(totalOrdersByCanceled).getRevenueByDelivering(revenueByDelivering)
				.getRevenueByPending(revenueByPending).getRevenueByCanceled(revenueByCanceled)
				.getRevenueByCompleted(revenueByCompleted).getTop3Users(topUsers).getTop3Product(topProducts)
				.getMonthlyRevenue(monthlyRevenue).build();

		ApiResponse<Object> response = ApiResponse.builder().statusCode("200").message("Lay thanh cong")
				.data(revenueResponse).build();

		return response;
	}

	private String getUserNameById(Long userId) {
		// Implement logic to get user name by ID
		return (userRepository.findFirstnameById(userId)).getFirstname();// Placeholder
	}

	private String getProductNameById(Long productId) {
		// Implement logic to get product name by ID
		return (productRepository.findNameById(productId)).getName();
	}

	@Override
	public ApiResponse<Object> getTop3Users() {
		List<Object[]> topUserResults = ordersRepository.findTopUsersWithOrderCountAndRevenue();
		List<UserRevenueResponse> topUsers = new ArrayList<>();
		for (Object[] result : topUserResults) {
			Long userId = ((Number) result[0]).longValue(); // Convert to Long
			Long totalOrderByUser = ((Number) result[1]).longValue(); // Convert to Long
			Long totalRevenueByUser = ((Number) result[2]).longValue(); // Convert to Long
			UserRevenueResponse userRevenueResponse = new UserRevenueResponse();
			userRevenueResponse.setUserid(userId);
			userRevenueResponse.setUsername((getUserNameById(userId)));
			userRevenueResponse.setGetTotalOrderByUser(totalOrderByUser);
			userRevenueResponse.setGetTotalRevenueByUser(totalRevenueByUser);
			
			
			topUsers.add(userRevenueResponse);
		}
		return ApiResponse.builder().statusCode("200").message("Lay thanh cong").data(topUsers).build();
	}

	@Override
	public ApiResponse<Object> getTop3Product() {
        List<Object[]> topProductResults = orderitemRepository.findTopProducts();
        List<ProductRevenueResponse> topProducts = new ArrayList<>();
        for (Object[] result : topProductResults) {
            Long productId = ((Number) result[0]).longValue(); // Convert to Long
            Long totalCount = ((Number) result[1]).longValue(); // Convert to Long
            ProductRevenueResponse productRevenueResponse = ProductRevenueResponse.builder()
            		.productid(productId)
            		.productname(getProductNameById(productId))
                    .getTotalCount(totalCount)
                    .build();
            topProducts.add(productRevenueResponse);
        }
            return ApiResponse.builder()
                    .statusCode("200")
                    .message("Lay thanh cong")
                    .data(topProducts)
                    .build();
	}

	@Override
	public ApiResponse<Object> getMonthlyRevenue(String startDate, String endDate) {
		List<Object[]> monthlyRevenueResults = ordersRepository.findMonthlyRevenue(startDate,endDate);
		List<RevenueByMonthResponse> monthlyRevenue = new ArrayList<>();
		for (Object[] result : monthlyRevenueResults) {
			String month = (String) result[0];
			Long revenue = ((Number) result[1]).longValue();
			RevenueByMonthResponse revenueByMonthResponse = RevenueByMonthResponse.builder().month(month)
					.revenue(revenue).build();
			monthlyRevenue.add(revenueByMonthResponse);
		}
		return ApiResponse.builder().statusCode("200").message("Lay thanh cong").data(monthlyRevenue).build();
	}

}
