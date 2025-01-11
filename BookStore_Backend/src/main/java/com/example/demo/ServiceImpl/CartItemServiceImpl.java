package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Cart;
import com.example.demo.Entity.CartItem;
import com.example.demo.Entity.Product;
import com.example.demo.Repository.CartItemRepository;
import com.example.demo.Repository.CartRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Service.CartItemService;
import com.example.demo.model.request.Cart.CartItemRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.AuthenticationResponse;
import com.example.demo.model.response.CartItemResponse;

import lombok.RequiredArgsConstructor;

@Service
public class CartItemServiceImpl implements CartItemService {

	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private ProductRepository productRepository;

	@Override
	public ApiResponse<Object> addCartItem(CartItemRequest request) {
		try {
			var existingCartItem = cartItemRepository.findByCartidAndProductid(request.getCartid(), request.getProductid());
			if (existingCartItem != null) {
	            // Nếu đã tồn tại, cập nhật lại số lượng
	            existingCartItem.setCount(existingCartItem.getCount() + request.getCount());
	            cartItemRepository.save(existingCartItem);

	            return ApiResponse.builder()
	                    .statusCode("200")
	                    .message("Updated CartItem count successfully")
	                    .build();
	        } else {
	            // Nếu chưa tồn tại, thêm mới CartItem
	            var cartItem = CartItem.builder()
	                    .cartid(request.getCartid())
	                    .productid(request.getProductid())
	                    .count(request.getCount())
	                    .build();

	            cartItemRepository.save(cartItem);

	            return ApiResponse.builder()
	                    .statusCode("200")
	                    .message("Add CartItem successfully")
	                    .build();
	        }

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}

	}

	@Override
	public ApiResponse<Object> getCartIDByUserID(int userid) {
		var cart = cartRepository.findCartByUserID(userid);
		try {
			var response = ApiResponse.builder().statusCode("200").message("Get CartID Sucessfully").data(cart.getId())
					.build();
			return response;

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Get failed").build();
		}
	}

	@Override
	public ApiResponse<Object> removeCartItemByID(Long cartid) {
		try {
			cartItemRepository.deleteById(cartid);
			var response = ApiResponse.builder().statusCode("200").message("Xóa thành công").build();
			return response;
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Xóa thất bại").build();
		}
	}

	@Override
	public ApiResponse<Object> getCartItemByCartID(int userid) {
		try {
			int cartid = cartRepository.findCartByUserID(userid).getId();
			List<CartItem> items= cartItemRepository.getCartItemByCartid(cartid);
			List<CartItemResponse> cartItemResponses= new ArrayList<CartItemResponse>();
			for(CartItem cart: items) {
			
				Product product= productRepository.findByid(cart.getProductid());
//				var carts= CartItemResponse.builder().product_name(product.getName()).
//																	descripttion(product.getDescription())
//																	.price(product.getPrice())
//																	.promotional_price(product.getPromotional_price())
//																	.image(product.getImage())
//																	.sold(product.getSold())
//																	.quantity(product.getQuantity())
//																	.rating(product.getRating())
//																	.count(cart.getCount());
				CartItemResponse carts = new CartItemResponse(		cart.getId(),
																	product.getId(),
																	product.getName(),
																	product.getDescription()
																	,product.getPrice()
																	,product.getPromotional_price()
																	,product.getQuantity()
																	,product.getSold()
																	,product.getImage()
																	,product.getRating()
																	,cart.getCount());
	
				cartItemResponses.add(carts);
			}
			var response = ApiResponse.builder()
					.statusCode("200").message("Lấy thành công CartItem").data(cartItemResponses).build();
			return response;
		} catch (Exception e) {
			return  ApiResponse.builder().statusCode("401").message("Lấy thất bại").build();
		}
	}

	@Override
	public ApiResponse<Object> deleteCartItemByCartID(int userid) {
		try {
			int cartid = cartRepository.findCartByUserID(userid).getId();
			cartItemRepository.deleteByCartid(cartid);
			var response = ApiResponse.builder().statusCode("200").message("Xóa thành công").build();
			return response;
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Xóa thất bại").build();
		}
	}

	@Override
	public void updateCartItemCount(int cartItemId, int newCount) {
	    CartItem cartItem = cartItemRepository.findById(cartItemId);
	    cartItem.setCount(newCount);
	    cartItemRepository.save(cartItem);
		
	}


}
