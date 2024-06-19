package com.example.demo.Service;

import org.springframework.stereotype.Service;

import com.example.demo.model.request.Review.ReviewRequest;
import com.example.demo.model.response.ApiResponse;

@Service
public interface ReviewService {

	ApiResponse<Object> addReview(ReviewRequest reviewRequest);
	ApiResponse<Object> getReviewByProductId(int productid);


}
