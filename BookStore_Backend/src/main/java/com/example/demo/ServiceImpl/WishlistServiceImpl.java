package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.CartItem;
import com.example.demo.Entity.Product;
import com.example.demo.Entity.User_Follow_Product;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.WishlistRepository;
import com.example.demo.Service.WishlistService;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.CartItemResponse;
import com.example.demo.model.response.WishlistResponse;

@Service
public class WishlistServiceImpl implements WishlistService{
	@Autowired
	private WishlistRepository wishlistRepository;
	@Autowired
	private ProductRepository productRepository;
	@Override
	public ApiResponse<Object> addToWishList(User_Follow_Product wishlist) {
		var myWishlist = User_Follow_Product.builder().userid(wishlist.getUserid()).productid(wishlist.getProductid()).build();
		try {
			wishlistRepository.save(myWishlist);
			var response = ApiResponse.builder().statusCode("200").message("Add wishlist Sucessfully").build();
			return response;

		} catch (Exception e) {
			return ApiResponse.builder().statusCode("401").message("Add failed").build();
		}
		

	}

	@Override
	public ApiResponse<Object> getWishListByUserId(int userid) {
		try {
			List<User_Follow_Product> wishlists = wishlistRepository.findByUserid(userid);
			List<Product> products = new ArrayList<>();
			for(User_Follow_Product wishlist: wishlists) {
			
				Product product= productRepository.findByid((long)wishlist.getProductid());
				products.add(product);
			}
			var response = ApiResponse.builder()
					.statusCode("200").message("Lấy thành công Wishlist").data(products).build();
			return response;
		} catch (Exception e) {
			return  ApiResponse.builder().statusCode("401").message("Lấy thất bại").build();
		}
	}

    @Override
    public void removeFromWishlist(int userId, int productId) {
    	wishlistRepository.deleteByUseridAndProductid(userId, productId);
    }

    @Override
    public void clearWishlist(int userId) {
    	wishlistRepository.deleteByUserid(userId);
    }

}
