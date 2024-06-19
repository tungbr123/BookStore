package com.example.demo.Service;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.User_Follow_Product;
import com.example.demo.model.response.ApiResponse;

@Service
public interface WishlistService {
	ApiResponse<Object> addToWishList(User_Follow_Product wishlist);
	ApiResponse<Object> getWishListByUserId(int userid);
    void removeFromWishlist(int userId, int productId);
    void clearWishlist(int userId);
}
