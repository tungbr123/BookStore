package com.example.demo.Controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Orders;
import com.example.demo.Service.CartItemService;
import com.example.demo.Service.OrderService;
import com.example.demo.Service.RevenueService;
import com.example.demo.model.request.Cart.CartItemRequest;
import com.example.demo.model.request.Orderitem.OrderitemRequest;
import com.example.demo.model.request.Orders.OrderRequest;
import com.example.demo.model.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class OrderController {
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private RevenueService revenueService;
	
    @PostMapping("/addOrder")
    public ResponseEntity<?> addOrder(@RequestBody OrderRequest request){
        return new ResponseEntity<>(orderService.addOrder(request), HttpStatus.OK);
    }
    @PutMapping("/confirmOrderFromUser")
    public ResponseEntity<?> confirmOrderFromUser(@RequestParam Long orderid){
        return new ResponseEntity<>(orderService.confirmOrderFromUser(orderid), HttpStatus.OK);
    }
    @PostMapping("/addOrderitem")
    public ResponseEntity<?> addOrderItem(@RequestBody List<OrderitemRequest> request){
        return new ResponseEntity<>(orderService.addOrderItem(request), HttpStatus.OK);
    }
    @GetMapping("/getOrdersByUserId")
    public ResponseEntity<?> getOrdersByUserId(@RequestParam(value = "userid") Long userid) {
        return new ResponseEntity<>(orderService.getOrdersByUserId(userid), HttpStatus.OK);
    }
    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }
    @GetMapping("/getOrdersWithPaging")
    public ResponseEntity<Page<Orders>> getOrdersWithPaging(
    		@RequestParam Long userid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Orders> orders = orderService.getOrdersByUserId(userid, page, size);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/getOrdersWithPagingByStatus")
    public ResponseEntity<?> getOrdersWithPagingByStatus(
        @RequestParam Long userid,
        @RequestParam(required = false) String status,
        @RequestParam int page,
        @RequestParam int size
    ) {
    	return new ResponseEntity<>(orderService.getOrdersByUserIdAndStatus(userid, status, page, size), HttpStatus.OK);
    }
    @GetMapping("/getAllOrdersWithPagingByStatus")
    public ResponseEntity<?> getAllOrdersWithPagingByStatus(
        @RequestParam(required = false) String status,
        @RequestParam int page,
        @RequestParam int size
    ) {
    	return new ResponseEntity<>(orderService.getAllOrdersByUserIdAndStatus( status, page, size), HttpStatus.OK);
    }
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
    	return new ResponseEntity<>(orderService.cancelOrderByOrderId(orderId), HttpStatus.OK);
    }
    @PutMapping("/confirm/{id}") 
    public ResponseEntity<?> confirmOrder(@PathVariable Long id) {
        return new ResponseEntity<>(orderService.updateOrderStatusToDelivering(id), HttpStatus.OK);
    }
    @PutMapping("/complete/{id}")
    public ResponseEntity<?> completeOrder(@PathVariable Long id) {
        return new ResponseEntity<>(orderService.completeOrder(id), HttpStatus.OK);
    }
    @GetMapping("/getRevenue")
    public ResponseEntity<?> getRevenueData() {
    	return new ResponseEntity<>(revenueService.getRevenue(), HttpStatus.OK);
    }
    @GetMapping("/getTop3Users")
    public ResponseEntity<?> getTop3Users() {
    	return new ResponseEntity<>(revenueService.getTop3Users(), HttpStatus.OK);
    }
    @GetMapping("/getTop3Product")
    public ResponseEntity<?> getTopProduct() {
    	return new ResponseEntity<>(revenueService.getTop3Product(), HttpStatus.OK);
    }
    @GetMapping("/getMonthlyRevenue")
    public ResponseEntity<?> getMonthlyRevenue( @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
    	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        
        // Convert LocalDate to String in yyyy-MM-dd format
        String startFormatted = start.format(formatter);
        String endFormatted = end.format(formatter);
    	return new ResponseEntity<>(revenueService.getMonthlyRevenue(startFormatted, endFormatted), HttpStatus.OK);
    }
}
