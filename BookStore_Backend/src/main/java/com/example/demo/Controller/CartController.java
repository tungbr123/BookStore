package com.example.demo.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Product;
import com.example.demo.Service.CartItemService;
import com.example.demo.model.request.Auth.RegisterRequest;
import com.example.demo.model.request.Cart.CartItemRequest;
import com.example.demo.model.request.Cart.UpdateCartItemCountRequest;
import com.example.demo.model.request.Orderitem.OrderitemRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class CartController {
	@Autowired
	private CartItemService cartItemService;
	
    @PostMapping("/cartItem")
    public ResponseEntity<?> addCartItem(@RequestBody CartItemRequest request){
        return new ResponseEntity<>(cartItemService.addCartItem(request), HttpStatus.OK);
    }
	@GetMapping("/getCartID") // Mapping for retrieving all books
	public ResponseEntity<?> getCartID(@RequestParam(value = "userid") int userid) {
		// Retrieve all books using BookService and return a ResponseEntity with the
		// list of books and HTTP status OK
		return new ResponseEntity<>(cartItemService.getCartIDByUserID(userid), HttpStatus.OK);
	}
	@DeleteMapping("/deleteCartItem")
	public ResponseEntity<?> deleteCartItem(@RequestParam(value="cartItemid") Long cartItemid){
		return new ResponseEntity<>(cartItemService.removeCartItemByID(cartItemid), HttpStatus.OK);
	}
	@GetMapping("/getCartItem")
	public ResponseEntity<?> getCartItemByCartID(@RequestParam(value = "userid") int userid) {
		// Retrieve all books using BookService and return a ResponseEntity with the
		// list of books and HTTP status OK
		return new ResponseEntity<>(cartItemService.getCartItemByCartID(userid), HttpStatus.OK);
	}
    @DeleteMapping("/deleteCartitemByUserID")
	public ResponseEntity<?> deleteCartitemByUserID(@RequestParam(value="userid") int userid){
		return new ResponseEntity<>(cartItemService.deleteCartItemByCartID(userid), HttpStatus.OK);
	}
    @PutMapping("/updateCartItemCount")
    public ResponseEntity<?> updateCartItemCount(@RequestBody UpdateCartItemCountRequest request) {
    	cartItemService.updateCartItemCount(request.getCartItemId(), request.getCount());
        return ResponseEntity.ok().build();
    }

}
