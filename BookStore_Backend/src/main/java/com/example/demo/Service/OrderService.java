package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Orders;
import com.example.demo.model.request.Orderitem.OrderitemRequest;
import com.example.demo.model.request.Orders.OrderRequest;
import com.example.demo.model.response.ApiResponse;

@Service
public interface OrderService {
	ApiResponse<Object> addOrder(OrderRequest request);
	ApiResponse<Object> addOrderItem(List<OrderitemRequest> request);
	ApiResponse<Object> getOrdersByUserId(Long userid);
	ApiResponse<Object> cancelOrderByOrderId(Long orderId);
	ApiResponse<Object> getAllOrders();
    Optional<Orders> getOrdersById(Long id);
    ApiResponse<Object> updateOrderStatusToDelivering(Long id);
    ApiResponse<Object> completeOrder(Long id);
}
