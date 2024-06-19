package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Orderitem;

@Repository
public interface OrderitemRepository extends JpaRepository<Orderitem, Long>{
	List<Orderitem> findByOrderid(Long orderid);
	@Query(value = "SELECT productid, COUNT(*) as product_count FROM Orderitem oi, Orders o where o.id=oi.orderId and o.status='completed' GROUP BY productid ORDER BY product_count DESC OFFSET 0 ROWS FETCH FIRST 3 ROWS ONLY", nativeQuery = true)
    List<Object[]> findTopProducts();
}
