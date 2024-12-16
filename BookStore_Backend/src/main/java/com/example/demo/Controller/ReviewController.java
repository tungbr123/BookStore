package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.ReviewService;
import com.example.demo.model.request.Review.ReviewRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
    @PostMapping("/addReview") // Mapping for adding a new book
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest reviewRequest) {    	
        return new ResponseEntity<>(reviewService.addReview(reviewRequest), HttpStatus.OK);
    }
    @GetMapping("/getReviews/{productId}")
    public ResponseEntity<?> getReviewsByProductId(@PathVariable int productId) {
    	return new ResponseEntity<>(reviewService.getReviewByProductId(productId), HttpStatus.OK);
    }
    @GetMapping("/getAllReviewsByUsers")
    public ResponseEntity<?> getAllReviewsByUsers(@RequestParam Long userid) {
    	return new ResponseEntity<>(reviewService.getAllReviewsByUsers(userid), HttpStatus.OK);
    }
}
