package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

    @Query(value = "SELECT * FROM Product WHERE name LIKE %:searchQuery%", nativeQuery = true)
    List<Product> searchProducts(@Param("searchQuery") String searchQuery);
	
	@Query("select p from Product p where p.id = ?1 ")
	Product findByid(Long id);

    @Query(value = "select * from Product p where p.id = ?1 ",nativeQuery = true)
	Product findByidWithInt(int id);

	Product findNameById(Long id);
	
    @Query(value = "SELECT TOP 5 * FROM product ORDER BY sold DESC", nativeQuery = true)
    List<Product> findTop5BestSellingProducts(); // Bestselling

    @Query(value = "SELECT TOP 5 * FROM product ORDER BY rating DESC", nativeQuery = true)
    List<Product> findTop5TrendingProducts(); // Trending

    @Query(value = "SELECT TOP 5 * FROM product ORDER BY promotional_price ASC", nativeQuery = true)
    List<Product> findTop5BestDeals(); // Best deals
    
    Page<Product> findAll(Pageable pageable);
    
    @Query(value = "SELECT * FROM Product p WHERE " +
            "(COALESCE(:category, NULL) IS NULL OR p.category_id = :category) AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))",
            countQuery = "SELECT COUNT(*) FROM Product p WHERE " +
            "(COALESCE(:category, NULL) IS NULL OR p.category_id = :category) AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))",
            nativeQuery = true)
    Page<Product> findByCategoryAndSearch(@Param("category") Long category, 
                                          @Param("search") String search, 
                                          Pageable pageable);

    @Query(value="select * from Product order by sold desc;", nativeQuery=true)
	Page<Product> findTopSellingProducts(Pageable pageable);

    @Query(value="select * from Product order by sold ;", nativeQuery=true)
	Page<Product> findLeastSellingProducts(Pageable pageable);

    @Query(value="select * from Product order by rating desc ;", nativeQuery=true)
	Page<Product> findMostRatingProducts(Pageable pageable);

    @Query(value="select * from Product order by rating asc ;", nativeQuery=true)
	Page<Product> findLeastRatingProducts(Pageable pageable);

    @Query(value="select * from Product  where quantity <= 10 order by quantity", nativeQuery=true)
	Page<Product> findLeastQuantityProducts(Pageable pageable);
}
