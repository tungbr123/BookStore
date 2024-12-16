package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.Product_Category;

public interface ProductCategoryRepository extends JpaRepository<Product_Category, Long>{

	@Query(value="select * from Product_Category where product_id = :id", nativeQuery=true)
	List<Product_Category> findAllByProductID(Long id);

}
