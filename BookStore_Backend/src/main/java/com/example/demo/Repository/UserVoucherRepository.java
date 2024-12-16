package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.User_Voucher;

public interface UserVoucherRepository extends JpaRepository<User_Voucher, Long>{

	@Query(value = "SELECT uv.id,uv.voucher_id, uv.status, uv.usage_count, uv.product_id, uv.user_id " +            
            "FROM User_Voucher uv " +
            "WHERE uv.user_id = :userId", nativeQuery = true)
	List<User_Voucher> findByUser_id(int userId);
	
	@Query(value = "SELECT uv.id,uv.voucher_id, uv.status, uv.product_id, uv.usage_count, uv.user_id " +            
            "FROM User_Voucher uv " +
            "WHERE uv.user_id = :userid and uv.status = :status", nativeQuery = true)
	List<User_Voucher> findByUser_idAndStatus(int userid, String status);

}
