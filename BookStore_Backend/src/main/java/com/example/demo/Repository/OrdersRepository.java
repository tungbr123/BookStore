package com.example.demo.Repository;

import java.time.LocalDate;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Orders;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long>{
//	@Query("SELECT p FROM Orders p ORDER BY p.status DESC LIMIT 1")
//	Orders findLastOrders();
	Orders findTopByOrderByIdDesc();
	

    @Query(value = "SELECT SUM(money_from_user) FROM Orders o where o.status='completed'", nativeQuery = true)
    Long findTotalRevenue();

    @Query(value = "SELECT COUNT(*) FROM Orders", nativeQuery = true)
    Long countTotalOrders();

    @Query(value = "SELECT userid, COUNT(*) as order_count, SUM(money_from_user) as total_revenue \r\n"
    		+ "FROM Orders o where o.status = 'completed' "
    		+ "GROUP BY userid ORDER BY order_count DESC OFFSET 0 ROWS FETCH FIRST 3 ROWS ONLY", nativeQuery = true)
    List<Object[]> findTopUsersWithOrderCountAndRevenue();
    
	List<Orders> findByUserid(Long userid);
	
    @Query(value = "SELECT SUM(o.money_from_user) FROM Orders o WHERE o.status = 'delivering'", nativeQuery = true)
    Long findRevenueByDelivering();

    @Query(value = "SELECT SUM(o.money_from_user) FROM Orders o WHERE o.status = 'pending'", nativeQuery = true)
    Long findRevenueByPending();

    @Query(value = "SELECT SUM(o.money_from_user) FROM Orders o WHERE o.status = 'canceled'", nativeQuery = true)
    Long findRevenueByCanceled();

    @Query(value = "SELECT SUM(o.money_from_user) FROM Orders o WHERE o.status = 'completed'", nativeQuery = true)
    Long findRevenueByCompleted();
    
    @Query(value = "SELECT CONVERT(varchar(7), date_order, 120) AS month_year, " +
            "       SUM(money_from_user) AS total_revenue " +
            "FROM Orders " +
            "WHERE date_order >= ?1 AND date_order <= ?2 " +
            "GROUP BY CONVERT(varchar(7), date_order, 120) " +
            "ORDER BY month_year", nativeQuery = true)
    List<Object[]> findMonthlyRevenue(String startDate, String endDate);
}
