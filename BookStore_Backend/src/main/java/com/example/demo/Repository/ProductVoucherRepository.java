package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Entity.ProductVoucher;

public interface ProductVoucherRepository extends JpaRepository<ProductVoucher, Long> {
	@Query(value = "SELECT pv.id, pv.product_id, pv.voucher_id, v.image_voucher, v.discount_value, v.end_date, v.min_order_value "
			+ "FROM Product_Voucher pv " + "JOIN Voucher v ON pv.voucher_id = v.id "
			+ "WHERE pv.product_id = :productId", nativeQuery = true)
	List<Object[]> findProductVoucherDetailsByProductId(@Param("productId") Long productId);
}
