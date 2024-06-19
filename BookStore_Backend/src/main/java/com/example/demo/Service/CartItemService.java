package com.example.demo.Service;

import java.util.List;

import com.example.demo.Entity.Cart;
import com.example.demo.Entity.CartItem;
import com.example.demo.model.request.Cart.CartItemRequest;
import com.example.demo.model.response.ApiResponse;

public interface CartItemService {
	ApiResponse<Object> addCartItem(CartItemRequest request);
	ApiResponse<Object> getCartIDByUserID(int userid);
	ApiResponse<Object> removeCartItemByID(Long cartid);
	ApiResponse<Object> getCartItemByCartID(int userid);
	ApiResponse<Object> deleteCartItemByCartID(int userid);
	void updateCartItemCount(int cartItemId, int newCount);
}
