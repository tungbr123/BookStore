package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.User_Follow_Product;
import com.example.demo.Service.UserService;
import com.example.demo.Service.WishlistService;
import com.example.demo.model.request.Auth.RegisterRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class WishlistController {
	@Autowired
	private WishlistService wishlistService;
	
    @PostMapping("/addToWishlist")
    public ResponseEntity<?> addToWishlist(@RequestBody User_Follow_Product request){
        return new ResponseEntity<>(wishlistService.addToWishList(request), HttpStatus.OK);
    }
    @GetMapping("/getWishlist")
    public ResponseEntity<?> getWishlist(@RequestParam(value = "userid") int userid){
        return new ResponseEntity<>(wishlistService.getWishListByUserId(userid), HttpStatus.OK);
    }
    @DeleteMapping("/removeWishlist")
    public void removeFromWishlist(@RequestParam int userId, @RequestParam int productId) {
        wishlistService.removeFromWishlist(userId, productId);
    }

    @DeleteMapping("/clearAllWishlist")
    public void clearWishlist(@RequestParam int userId) {
        wishlistService.clearWishlist(userId);
    }
}
