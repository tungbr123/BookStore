package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Order_Voucher;

@Repository
public interface OrderVoucherRepository extends JpaRepository<Order_Voucher, Long>{
	List<Order_Voucher> findByOrderid(Long orderid);
} 

