package com.example.demo.ServiceImpl;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import com.example.demo.Entity.CartItem;
import com.example.demo.Entity.Delivery;
import com.example.demo.Entity.Order_Voucher;
import com.example.demo.Entity.Orderitem;
import com.example.demo.Entity.Orders;
import com.example.demo.Entity.Product;
import com.example.demo.Entity._User;
import com.example.demo.Repository.CartItemRepository;
import com.example.demo.Repository.DeliveryRepository;
import com.example.demo.Repository.OrderVoucherRepository;
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
	private OrderVoucherRepository orderVoucherRepository;
	@Autowired
	private EmailService emailService;

	public ApiResponse<Object> addOrder(OrderRequest request) {
		long millis = System.currentTimeMillis();
		java.sql.Date date = new java.sql.Date(millis);
		var order = Orders.builder().userid(request.getUserid()).deliveryid(1).address(request.getAddress())
				.phone(request.getPhone()).is_paid_before(request.getIs_paid_before())
				.money_from_user(request.getMoney_from_user()).status("pending").date_order(date).build();
		try {

			orderRepository.save(order);
			var response = ApiResponse.builder().statusCode("200").message("Add Order Sucessfully").build();
			// String emailContent = buildOrderConfirmationEmail(request.getName());
			// emailService.send(request.getEmail(), emailContent);
			return response;

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}
	}

	@Override
	public ApiResponse<Object> addOrderItem(List<OrderitemRequest> request) {
		Orders order = orderRepository.findTopByOrderByIdDesc();
		Long orderid = order.getId();

		// Lấy thông tin người dùng từ order
		_User user = userRepository.findById(order.getUserid()).orElse(null);
		// Danh sách các sản phẩm trong đơn hàng
		List<OrderitemResponse> orderItemResponseList = new ArrayList<>();

		try {
			for (OrderitemRequest orderRequest : request) {
				var orderitem = Orderitem.builder().orderid(orderid).productid(orderRequest.getProductid())
						.count(orderRequest.getCount()).build();
				orderitemRepository.save(orderitem);
				// Lấy thông tin sản phẩm

				Product product = productRepository.findByidWithInt(orderRequest.getProductid());
				if (product != null) {
					OrderitemResponse orderItemResponse = new OrderitemResponse();
					orderItemResponse.setProductid(orderRequest.getProductid());
					orderItemResponse.setCount(orderRequest.getCount());
					orderItemResponse.setName(product.getName());
					orderItemResponse.setImage(product.getImage());
					orderItemResponse.setPromotion_price(product.getPromotional_price());
					orderItemResponseList.add(orderItemResponse);
				}
			}
			// Tạo nội dung email với thông tin người dùng và sản phẩm
			// String emailContent = buildOrderConfirmationEmailWithProducts(user,
			// orderItemResponseList);
			var response = ApiResponse.builder().statusCode("200").message("Add OrderItem Sucessfully").build();

			String emailContent = buildOrderConfirmationEmailWithProducts(user, orderItemResponseList);
			emailService.send(user.getEmail(), emailContent);
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
				orderResponse.setDate_order(order.getDate_order());
				orderResponse.setAddress(order.getAddress());
				orderResponse.setPhone(order.getPhone());
				orderResponse.setUserid(order.getUserid());
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
	public Page<Orders> getOrdersByUserId(Long userid, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return orderRepository.findByUserid(userid, pageable);
	}

	@Override
	public ApiResponse<Object> getOrdersByUserIdAndStatus(Long userId, String status, int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date_order"));

			// Lấy danh sách đơn hàng theo trạng thái
			Page<Orders> ordersPage;
			int totalPages = 0;

			if (status.equals("all")) {
				ordersPage = orderRepository.findAllByUserid(userId, pageable);

			} else {
				ordersPage = orderRepository.findByUseridAndStatus(userId, status, pageable);

			}
			totalPages = ordersPage.getTotalPages();
			if (ordersPage.isEmpty()) {
				return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
						.build();
			}

			// Chuẩn bị dữ liệu phản hồi
			List<OrderResponse> result = new ArrayList<>();
			Map<Long, Product> productMap = productRepository.findAll().stream()
					.collect(Collectors.toMap(Product::getId, product -> product));
			for (Orders order : ordersPage.getContent()) {
				OrderResponse orderResponse = new OrderResponse();
				int totalDiscountOnOrder = 0;
				List<Order_Voucher> order_vouchers = orderVoucherRepository.findByOrderid(order.getId());
				for (Order_Voucher order_voucher : order_vouchers) {
					totalDiscountOnOrder = totalDiscountOnOrder + order_voucher.getDiscount_value();
				}
				orderResponse.setId(order.getId());
				orderResponse.setStatus(order.getStatus());
				orderResponse.setDate_order(order.getDate_order());
				orderResponse.setAddress(order.getAddress());
				orderResponse.setPhone(order.getPhone());
				orderResponse.setUserid(order.getUserid());
				orderResponse.setAmountFromUser(order.getMoney_from_user());
				orderResponse.setDiscount_value_vouchers(totalDiscountOnOrder);
				orderResponse.setTotalPages(totalPages);
				// Lấy danh sách sản phẩm trong đơn hàng
				List<Orderitem> orderItems = orderitemRepository.findByOrderid(order.getId());
				List<OrderitemResponse> orderItemResponseList = new ArrayList<>();
				for (Orderitem orderItem : orderItems) {
					Product product = productMap.get((long) orderItem.getProductid());
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
			// Trả về dữ liệu phân trang
			return ApiResponse.builder().statusCode("200").message("Get Orders Successfully").data(result).build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("Internal Server Error: " + e.getMessage())
					.data(null).build();
		}
	}

	@Override
	public ApiResponse<Object> getAllOrdersByUserIdAndStatus(String status, int page, int size) {
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date_order"));
			Date today = new Date();
			// Lấy danh sách đơn hàng theo trạng thái
			Page<Orders> ordersPage;
			int totalPages = 0;
			if (status.equals("all")) {
				ordersPage = orderRepository.findAll(pageable);
			} else {
				if (status.equals("need-confirmation")) {
					ordersPage = orderRepository.findOverdueOrders(pageable);
				} else {
					ordersPage = orderRepository.findAllByStatus(status, pageable);
				}
			}
			totalPages = ordersPage.getTotalPages();
			if (ordersPage.isEmpty()) {
				return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
						.build();
			}

			// Chuẩn bị dữ liệu phản hồi
			List<OrderResponse> result = new ArrayList<>();
			Map<Long, Product> productMap = productRepository.findAll().stream()
					.collect(Collectors.toMap(Product::getId, product -> product));
			for (Orders order : ordersPage.getContent()) {
				_User user = userRepository.findById(order.getUserid()).orElse(null);
				Delivery delivery = deliveryRepository.findById(order.getDeliveryid()).orElse(null);
				OrderResponse orderResponse = new OrderResponse();
				if ("pending".equalsIgnoreCase(order.getStatus())) {
					// Tính số ngày chờ từ ngày đặt hàng đến hôm nay
					long daysPending;

					long diffInMillis = today.getTime() - order.getDate_order().getTime();
					daysPending = diffInMillis / (1000 * 60 * 60 * 24);
					// Nếu quá 2 ngày, đánh dấu là quá hạn
					if (daysPending > 2) {
						orderResponse.setOverdue(true);
						orderResponse.setDaysPending(daysPending);
						orderResponse.setMessageStatusPending(
								"Đã quá " + daysPending + " ngày đơn hàng chưa được xác nhận.");
					} else {
						orderResponse.setOverdue(false);
						orderResponse.setDaysPending(daysPending);
						orderResponse.setMessageStatusPending("Đơn hàng cần được các nhận");
					}
				} else {
					orderResponse.setOverdue(false);
					orderResponse.setDaysPending(0); // Không áp dụng cho các trạng thái khác
					orderResponse.setMessageStatusPending("Đơn hàng không ở trạng thái pending");
				}
				int totalDiscountOnOrder = 0;
				List<Order_Voucher> order_vouchers = orderVoucherRepository.findByOrderid(order.getId());
				for (Order_Voucher order_voucher : order_vouchers) {
					totalDiscountOnOrder = totalDiscountOnOrder + order_voucher.getDiscount_value();
				}
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
				orderResponse.setDate_order(order.getDate_order());
				orderResponse.setAmountFromUser(order.getMoney_from_user());
				orderResponse.setDiscount_value_vouchers(totalDiscountOnOrder);
				orderResponse.setTotalPages(totalPages);
				// Lấy danh sách sản phẩm trong đơn hàng
				List<Orderitem> orderItems = orderitemRepository.findByOrderid(order.getId());
				List<OrderitemResponse> orderItemResponseList = new ArrayList<>();
				for (Orderitem orderItem : orderItems) {
					Product product = productMap.get((long) orderItem.getProductid());
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
			// Trả về dữ liệu phân trang
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

				_User user = userRepository.findById(order.getUserid()).orElse(null);
				Delivery delivery = deliveryRepository.findById(order.getDeliveryid()).orElse(null);

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
				orderResponse.setDate_order(order.getDate_order());
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
					return ApiResponse.builder().statusCode("200").message("Order status updated to delivering")
							.data(order).build();
				} else {
					return ApiResponse.builder().statusCode("400").message("Order status is not pending").data(null)
							.build();
				}
			} else {
				return ApiResponse.builder().statusCode("404").message("Order not found").data(null).build();
			}
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("An error occurred while updating the order status")
					.data(null).build();
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
					return ApiResponse.builder().statusCode("200").message("Order completed successfully").data(order)
							.build();
				} else {
					return ApiResponse.builder().statusCode("400").message("Order status is not delivering").data(null)
							.build();
				}
			} else {
				return ApiResponse.builder().statusCode("404").message("Order not found").data(null).build();
			}
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("An error occurred while completing the order")
					.data(null).build();
		}
	}

	public String buildOrderConfirmationEmailWithProducts(_User user, List<OrderitemResponse> orderItems) {
		String emailContent = "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n"
				+ "\n" + "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" + "\n"
				+ "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
				+ "    <tbody><tr>\n" + "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" + "        \n"
				+ "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n"
				+ "          <tbody><tr>\n" + "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n"
				+ "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
				+ "                  <tbody><tr>\n" + "                    <td style=\"padding-left:10px\">\n"
				+ "                  \n" + "                    </td>\n"
				+ "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n"
				+ "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Order Confirmation</span>\n"
				+ "                    </td>\n" + "                  </tr>\n" + "                </tbody></table>\n"
				+ "            </td>\n" + "          </tr>\n" + "        </tbody></table>\n" + "        \n"
				+ "      </td>\n" + "    </tr>\n" + "  </tbody></table>\n"
				+ "  <table role=\"presentation\" class=\"content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
				+ "    <tbody><tr>\n" + "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n"
				+ "      <td>\n" + "        \n"
				+ "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
				+ "                  <tbody><tr>\n"
				+ "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n"
				+ "                  </tr>\n" + "                </tbody></table>\n" + "        \n" + "      </td>\n"
				+ "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" + "    </tr>\n"
				+ "  </tbody></table>\n" + "\n" + "\n" + "\n"
				+ "  <table role=\"presentation\" class=\"content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
				+ "    <tbody><tr>\n" + "      <td height=\"30\"><br></td>\n" + "    </tr>\n" + "    <tr>\n"
				+ "      <td width=\"10\" valign=\"middle\"><br></td>\n"
				+ "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n"
				+ "        \n"
				+ "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi "
				+ user.getFirstname() + " " + user.getLastname() + ",</p>\n"
				+ "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Your order has been received successfully! Thank you for shopping with us.</p>\n"
				+ "            <p>Here are the details of your order:</p>\n"
				+ "            <table border='1' cellpadding='5' cellspacing='0' style='width:100%;border-collapse:collapse;'>\n"
				+ "                <tr>\n" + "                    <th>Product Name</th>\n"
				+ "                    <th>Quantity</th>\n" + "                    <th>Price</th>\n"
				+ "                </tr>\n";

		// Thêm thông tin sản phẩm vào emailContent
		for (OrderitemResponse item : orderItems) {
			emailContent += "                <tr>\n" + "                    <td>" + item.getName() + "</td>\n"
					+ "                    <td>" + item.getCount() + "</td>\n" + "                    <td>"
					+ item.getPromotion_price() + "</td>\n" + "                </tr>\n";
		}

		emailContent += "            </table>\n" + "            <p>We hope you enjoy your purchase!</p>\n"
				+ "            <p>Best regards,<br>Your Company</p>\n" + "        \n" + "      </td>\n"
				+ "      <td width=\"10\" valign=\"middle\"><br></td>\n" + "    </tr>\n" + "    <tr>\n"
				+ "      <td height=\"30\"><br></td>\n" + "    </tr>\n"
				+ "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" + "\n" + "</div></div>";

		return emailContent;
	}

	public String buildOrderConfirmationEmail(String name) {
		return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" + "\n"
				+ "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" + "\n"
				+ "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
				+ "    <tbody><tr>\n" + "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" + "        \n"
				+ "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n"
				+ "          <tbody><tr>\n" + "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n"
				+ "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
				+ "                  <tbody><tr>\n" + "                    <td style=\"padding-left:10px\">\n"
				+ "                  \n" + "                    </td>\n"
				+ "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n"
				+ "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Order Confirmation</span>\n"
				+ "                    </td>\n" + "                  </tr>\n" + "                </tbody></table>\n"
				+ "              </a>\n" + "            </td>\n" + "          </tr>\n" + "        </tbody></table>\n"
				+ "        \n" + "      </td>\n" + "    </tr>\n" + "  </tbody></table>\n"
				+ "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
				+ "    <tbody><tr>\n" + "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n"
				+ "      <td>\n" + "        \n"
				+ "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
				+ "                  <tbody><tr>\n"
				+ "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n"
				+ "                  </tr>\n" + "                </tbody></table>\n" + "        \n" + "      </td>\n"
				+ "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" + "    </tr>\n"
				+ "  </tbody></table>\n" + "\n" + "\n" + "\n"
				+ "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
				+ "    <tbody><tr>\n" + "      <td height=\"30\"><br></td>\n" + "    </tr>\n" + "    <tr>\n"
				+ "      <td width=\"10\" valign=\"middle\"><br></td>\n"
				+ "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n"
				+ "        \n"
				+ "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name
				+ ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Your order has been received successfully! Thank you for shopping with us.</p>\n"
				+ "        \n" + "      </td>\n" + "      <td width=\"10\" valign=\"middle\"><br></td>\n"
				+ "    </tr>\n" + "    <tr>\n" + "      <td height=\"30\"><br></td>\n" + "    </tr>\n"
				+ "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" + "\n" + "</div></div>";
	}

}
