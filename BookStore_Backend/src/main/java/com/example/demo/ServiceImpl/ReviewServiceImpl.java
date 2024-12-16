package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Review;
import com.example.demo.Entity._User;
import com.example.demo.Repository.ReviewRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.ReviewService;
import com.example.demo.model.request.Review.ReviewRequest;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.ReviewResponse;

@Service
public class ReviewServiceImpl implements ReviewService {
	@Autowired
	private ReviewRepository reviewRepository;
	@Autowired
	private UserRepository userRepository;

	@Override
	public ApiResponse<Object> addReview(ReviewRequest reviewRequest) {
		try {
			Review review = new Review();
			review.setProductid(reviewRequest.getProductid());
			review.setUserid(reviewRequest.getUserid());
			review.setStars(reviewRequest.getStars());
			review.setContent(reviewRequest.getContent());
			review.setOrderid(reviewRequest.getOrderid());
			reviewRepository.save(review);
			return ApiResponse.builder().statusCode("200").message("Review submitted successfully").data(null).build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").message("An error occurred while submitting the review")
					.data(null).build();
		}
	}

	public ApiResponse<Object> getReviewByProductId(int productid) {
		try {
			List<Review> reviews = reviewRepository.findByProductid(productid);
			List<ReviewResponse> responseList = new ArrayList<>();
			for (Review review : reviews) {
				ReviewResponse response = new ReviewResponse();
				response.setStars(review.getStars());
				response.setContent(review.getContent());
				response.setOrderid(review.getOrderid());
				// Set name and image from user id
				_User user = userRepository.findById(review.getUserid());
				if (user != null) {
					response.setName(user.getFirstname());
					response.setImage(user.getAvatar());
					response.setUserid(user.getId());
				}
				responseList.add(response);
			}
			return ApiResponse.builder().statusCode("200").message("Get Review successfully").data(responseList)
					.build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("404").message("An error occurred while getting the review")
					.data(null).build();
		}
	}

	@Override
	public ApiResponse<Object> getAllReviewsByUsers(Long userid) {
		try {
			List<Review> reviews= reviewRepository.findByUserid(userid);
			return ApiResponse.builder().statusCode("200").message("Get Review successfully").data(reviews)
					.build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("404").message("An error occurred while getting the review")
					.data(null).build();
		}
	}
}
