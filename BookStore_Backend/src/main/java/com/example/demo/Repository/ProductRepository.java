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
    
    @Query(value = "SELECT TOP 5 * FROM product where category_id = :categoryid", nativeQuery = true)
    List<Product> getAllProductByCategory(int categoryid);

    @Query(value = "SELECT TOP 5 * FROM product ORDER BY rating DESC", nativeQuery = true)
    List<Product> findTop5TrendingProducts(); // Trending

    @Query(value = "SELECT TOP 5 * FROM product ORDER BY promotional_price ASC", nativeQuery = true)
    List<Product> findTop5BestDeals(); // Best deals
    
    Page<Product> findAll(Pageable pageable);
    
    @Query(value = "SELECT  p.* FROM Product p , Product_Category pc \r\n"
    		+ "WHERE (:category IS NULL OR pc.category_id = :category) and p.id = pc.product_id\r\n"
    		+ "  AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) \r\n"
    		+ "       OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))\r\n"
    		+ "GROUP BY p.id, p.name, p.description, p.price, p.promotional_price, p.quantity, p.sold, p.image, p.rating, p.translator, p.supplier, p.publisher, p.published_date, p.pages, p.weight\r\n"
    		+ "ORDER BY p.id",
            nativeQuery = true)
    Page<Product> findDistinctByCategoryAndSearch(@Param("category") Long category, 
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
