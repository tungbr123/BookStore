package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.CartItem;
import com.example.demo.Entity.Delivery;
import com.example.demo.Entity.Orderitem;
import com.example.demo.Entity.Orders;
import com.example.demo.Entity.Product;
import com.example.demo.Entity._User;
import com.example.demo.Repository.CartItemRepository;
import com.example.demo.Repository.DeliveryRepository;
import com.example.demo.Repository.OrderitemRepository;
import com.example.demo.Repository.OrdersRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.EmailService;
import com.example.demo.Service.OrderService;
import com.example.demo.model.request.Orderitem.OrderitemRequest;
import com.example.demo.model.request.Orders.OrderRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.OrderResponse;
import com.example.demo.model.response.OrderitemResponse;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	private OrdersRepository orderRepository;
	@Autowired
	private OrderitemRepository orderitemRepository;
	@Autowired
	private CartItemRepository cartitemRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired 
	private UserRepository userRepository;
	@Autowired
	private DeliveryRepository deliveryRepository;
	@Autowired
	private EmailService emailService;
	public ApiResponse<Object> addOrder(OrderRequest request) {
		long millis = System.currentTimeMillis();
		java.sql.Date date = new java.sql.Date(millis);
		var order = Orders.builder().userid(request.getUserid()).deliveryid(1).address(request.getAddress())
				.phone(request.getPhone()).is_paid_before(0).money_from_user(request.getMoney_from_user())
				.status("pending").date_order(date).build();
		try {

			orderRepository.save(order);
			var response = ApiResponse.builder().statusCode("200").message("Add Order Sucessfully").build();
			String emailContent = buildOrderConfirmationEmail(request.getName());
			emailService.send(request.getEmail(), emailContent);
			return response;
			
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}
	}

	@Override
	public ApiResponse<Object> addOrderItem(List<OrderitemRequest> request) {
		Orders order = orderRepository.findTopByOrderByIdDesc();
		Long orderid = order.getId();
		try {
			for (OrderitemRequest orderRequest : request) {
//				orderRequest.setCount(1);
				System.out.println(orderRequest.getProductid());
				System.out.println(orderRequest.getCount());
				var orderitem = Orderitem.builder().orderid(orderid).productid(orderRequest.getProductid())
						.count(orderRequest.getCount()).build();
				orderitemRepository.save(orderitem);
			}
			var response = ApiResponse.builder().statusCode("200").message("Add OrderItem Sucessfully").build();
			
			return response;
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}
	}

	@Override
	public ApiResponse<Object> getOrdersByUserId(Long userid) {
		try {
			List<Orders> ordersList = orderRepository.findByUserid(userid);
			if (ordersList == null || ordersList.isEmpty()) {
				return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
						.build();
			}

			List<OrderResponse> result = new ArrayList<>();
			for (Orders order : ordersList) {
				OrderResponse orderResponse = new OrderResponse();
				orderResponse.setId(order.getId());
				orderResponse.setStatus(order.getStatus());
				orderResponse.setDateOrder(order.getDate_order());
				orderResponse.setAmountFromUser(order.getMoney_from_user());

				List<Orderitem> orderItems = orderitemRepository.findByOrderid(order.getId());
				List<OrderitemResponse> orderItemResponseList = new ArrayList<>();
				for (Orderitem orderItem : orderItems) {
					Product product = productRepository.findById((long) orderItem.getProductid()).orElse(null);
					if (product != null) {
						OrderitemResponse orderItemResponse = new OrderitemResponse();
						orderItemResponse.setProductid(orderItem.getProductid());						
						orderItemResponse.setCount(orderItem.getCount());
						orderItemResponse.setName(product.getName());
						orderItemResponse.setImage(product.getImage());
						orderItemResponse.setPromotion_price(product.getPromotional_price());
						orderItemResponseList.add(orderItemResponse);
					}
				}

				orderResponse.setOrderItems(orderItemResponseList);
				result.add(orderResponse);
			}

			return ApiResponse.builder().statusCode("200").message("Get Orders Successfully").data(result).build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Internal Server Error: " + e.getMessage())
					.data(null).build();
		}
	}

	@Override
	public ApiResponse<Object> cancelOrderByOrderId(Long orderId) {
		try {
			Optional<Orders> optionalOrder = orderRepository.findById(orderId);
			if (optionalOrder.isPresent()) {
				Orders order = optionalOrder.get();
				order.setStatus("canceled");
				orderRepository.save(order);
				return ApiResponse.builder().statusCode("200").message("Order canceled successfully").data(null)
						.build();
			} else {
				return ApiResponse.builder().statusCode("404").message("Order not found").data(null).build();
			}
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("An error occurred while canceling the order")
					.data(null).build();
		}
	}

	@Override
	public ApiResponse<Object> getAllOrders() {
		try {
			List<Orders> ordersList = orderRepository.findAll();
			if (ordersList == null || ordersList.isEmpty()) {
				return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
						.build();
			}
			
			List<OrderResponse> result = new ArrayList<>();
			for (Orders order : ordersList) {
				
				_User user= userRepository.findById(order.getUserid()).orElse(null);
				Delivery delivery= deliveryRepository.findById(order.getDeliveryid()).orElse(null);
				
				OrderResponse orderResponse = new OrderResponse();
				
				orderResponse.setAddress(order.getAddress());
				orderResponse.setPhone(order.getPhone());
				orderResponse.setFirstname(user.getFirstname());
				orderResponse.setLastname(user.getLastname());
				orderResponse.setEmail(user.getEmail());
				
				orderResponse.setDelivery_name(delivery.getName());
				orderResponse.setDelivery_price(delivery.getPrice());
				
				orderResponse.setUserid(order.getUserid());
				orderResponse.setId(order.getId());
				orderResponse.setStatus(order.getStatus());
				orderResponse.setDateOrder(order.getDate_order());
				orderResponse.setAmountFromUser(order.getMoney_from_user());

				List<Orderitem> orderItems = orderitemRepository.findByOrderid(order.getId());
				List<OrderitemResponse> orderItemResponseList = new ArrayList<>();
				for (Orderitem orderItem : orderItems) {
					Product product = productRepository.findById((long) orderItem.getProductid()).orElse(null);
					if (product != null) {
						OrderitemResponse orderItemResponse = new OrderitemResponse();
						orderItemResponse.setProductid(orderItem.getProductid());	
						orderItemResponse.setCount(orderItem.getCount());
						orderItemResponse.setName(product.getName());
						orderItemResponse.setImage(product.getImage());
						orderItemResponse.setPromotion_price(product.getPromotional_price());
						orderItemResponseList.add(orderItemResponse);
					}
				}

				orderResponse.setOrderItems(orderItemResponseList);
				result.add(orderResponse);
			}

			return ApiResponse.builder().statusCode("200").message("Get Orders Successfully").data(result).build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Internal Server Error: " + e.getMessage())
					.data(null).build();
		}
	}

	@Override
	public Optional<Orders> getOrdersById(Long id) {
		return orderRepository.findById(id);
	}

	@Override
	public ApiResponse<Object> updateOrderStatusToDelivering(Long id) {
		 try {
	            Optional<Orders> optionalOrder = orderRepository.findById(id);
	            if (optionalOrder.isPresent()) {
	                Orders order = optionalOrder.get();
	                if ("pending".equals(order.getStatus())) {
	                    order.setStatus("delivering");
	                    orderRepository.save(order);
	                    return ApiResponse.builder()
	                            .statusCode("200")
	                            .message("Order status updated to delivering")
	                            .data(order)
	                            .build();
	                } else {
	                    return  ApiResponse.builder()
	                            .statusCode("400")
	                            .message("Order status is not pending")
	                            .data(null)
	                            .build();
	                }
	            } else {
	                return  ApiResponse.builder()
	                        .statusCode("404")
	                        .message("Order not found")
	                        .data(null)
	                        .build();
	            }
	        } catch (Exception e) {
	            return  ApiResponse.builder()
	                    .statusCode("500")
	                    .message("An error occurred while updating the order status")
	                    .data(null)
	                    .build();
	        }
	}

	@Override
	public ApiResponse<Object> completeOrder(Long id) {
		try {
            Optional<Orders> optionalOrder = orderRepository.findById(id);
            if (optionalOrder.isPresent()) {
                Orders order = optionalOrder.get();
                if ("delivering".equals(order.getStatus())) {
                    order.setStatus("completed");
                    orderRepository.save(order);
                    return ApiResponse.builder()
                            .statusCode("200")
                            .message("Order completed successfully")
                            .data(order)
                            .build();
                } else {
                    return ApiResponse.builder()
                            .statusCode("400")
                            .message("Order status is not delivering")
                            .data(null)
                            .build();
                }
            } else {
                return ApiResponse.builder()
                        .statusCode("404")
                        .message("Order not found")
                        .data(null)
                        .build();
            }
        } catch (Exception e) {
            return  ApiResponse.builder()
                    .statusCode("500")
                    .message("An error occurred while completing the order")
                    .data(null)
                    .build();
        }
	}

	public String buildOrderConfirmationEmail(String name) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Order Confirmation</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Your order has been received successfully! Thank you for shopping with us.</p>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

}
