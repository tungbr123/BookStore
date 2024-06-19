package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{
	@Query("SELECT u FROM Cart u WHERE u.userid = ?1")
    Cart findCartByUserID(int userid);


}
