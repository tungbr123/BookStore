package com.example.demo.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Orders;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
//	@Query("SELECT p FROM Orders p ORDER BY p.status DESC LIMIT 1")
//	Orders findLastOrders();
	Orders findTopByOrderByIdDesc();

	Page<Orders> findByUserid(Long userid, Pageable pageable);

	@Query(value = "select * from Orders where userid = ?1 and status = ?2", nativeQuery = true)
	Page<Orders> findByUseridAndStatus(Long userId, String status, Pageable pageable);

	@Query(value = "SELECT * FROM Orders o where o.status = :status", nativeQuery = true)
	Page<Orders> findAllByStatus(@Param("status") String status, Pageable pageable);
	
	@Query(value = "select * from Orders", nativeQuery = true)
	Page<Orders> findAll(Pageable pageable);
	
	@Query(value = "select * from Orders where userid = ?1", nativeQuery = true)
	Page<Orders> findAllByUserid(Long userId, Pageable pageable);
	
	@Query(value = "SELECT * FROM Orders o", nativeQuery = true)
	Page<Orders> findAllOrders(Pageable pageable);

	
	@Query(value = "SELECT * FROM Orders o WHERE o.status = 'pending' AND DATEDIFF(DAY, o.date_order, GETDATE()) > 2", nativeQuery = true)
	Page<Orders> findOverdueOrders(Pageable pageable);

	@Query(value = "SELECT SUM(money_from_user) FROM Orders o where o.status='completed'", nativeQuery = true)
	Long findTotalRevenue();

	Long countByStatus(String status);

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
	
	@Query(value = "SELECT COUNT(*) FROM Orders where status='pending'", nativeQuery = true)
	Long countTotalOrdersByPending();
	
	@Query(value = "SELECT COUNT(*) FROM Orders where status = 'delivering'", nativeQuery = true)
	Long countTotalOrdersByDelivering();
	
	@Query(value = "SELECT COUNT(*) FROM Orders where status = 'completed'", nativeQuery = true)
	Long countTotalOrdersByCompleted();
	
	@Query(value = "SELECT COUNT(*) FROM Orders where status='canceled'", nativeQuery = true)
	Long countTotalOrdersByCanceled();

	@Query(value = "SELECT CONVERT(varchar(7), date_order, 120) AS month_year, "
			+ "       SUM(money_from_user) AS total_revenue " + "FROM Orders "
			+ "WHERE date_order >= ?1 AND date_order <= ?2 AND status= 'completed' " + "GROUP BY CONVERT(varchar(7), date_order, 120) "
			+ "ORDER BY month_year", nativeQuery = true)
	List<Object[]> findMonthlyRevenue(String startDate, String endDate);
}
