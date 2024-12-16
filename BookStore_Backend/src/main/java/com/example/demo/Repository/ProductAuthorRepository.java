package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.Product_Author;

public interface ProductAuthorRepository extends JpaRepository<Product_Author, Long>{

	@Query(value="select * from Product_Author where product_id = :id", nativeQuery= true)
	List<Product_Author> findAllById(Long id);

}
