package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>{
	@Query("select u from Cartitem u where u.cartid=?1")
	List<CartItem> getCartItemByCartid(int cartid);
	
    @Modifying
    @Transactional
    @Query("Delete from CartItem c where c.cartid=?1")
    void deleteByCartid(int cartid);
    
    CartItem findById(int cartitemid);
}
