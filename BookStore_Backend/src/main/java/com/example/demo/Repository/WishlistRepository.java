package com.example.demo.Repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity.User_Follow_Product;


public interface WishlistRepository extends JpaRepository<User_Follow_Product, Integer>{
	
	@Query("select p from User_Follow_Product p where p.userid = ?1 ")
	List<User_Follow_Product> findByUserid(int userid);
	
    @Modifying
    @Transactional
    void deleteByUseridAndProductid(int userId, int productId);

    @Modifying
    @Transactional
    void deleteByUserid(int userId);
}
