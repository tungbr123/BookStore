package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Review;


public interface ReviewRepository extends JpaRepository<Review, Integer>{

	List<Review> findByProductid(int productid);

	List<Review> findByUserid(Long userid);

}
