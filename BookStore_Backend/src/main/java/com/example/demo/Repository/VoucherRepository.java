package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Voucher;
import com.example.demo.model.response.UserVoucherResponse;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long>{
    @Query(value = "SELECT v.* FROM Voucher v JOIN User_Voucher uv ON v.id = uv.voucher_id WHERE uv.user_id = :userId", nativeQuery = true)
    List<Voucher> findVouchersByUserId(@Param("userId") Long userId);
    
    
    @Query(value="select * from Voucher", nativeQuery = true)
    Page<Voucher> findAllVouchers(Pageable pageable);
    
	Voucher findById(int voucher_id);

	@Query(value="select * from User_Voucher u, Product_Voucher p\r\n"
			+ "where u.voucher_id = p.voucher_id and u.user_id = :userid and u.voucher_id= :voucherid and product_id= :productid", nativeQuery=true)
	List<Object[]> findUserVoucherOnProduct(int userid, int productid, int voucherid);
}
