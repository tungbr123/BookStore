package com.example.demo.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Product;
import com.example.demo.model.response.ProductResponse;

@Service
public interface ProductService {

	public List<ProductResponse> getAllProduct();

	public Product addProduct(Product product);
	
	public Product getProductByID(Long id);
	
	public List<Product> getAllProductByName(String name);
	
    Product createProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    
    List<Product> getTrendingProducts();
    
    List<Product> getBestSellingProducts();
    
    List<Product> getBestDeals();
    
    List<Product> getAllProducts();
    
    Page<Product> findAll(Pageable pageable);
    
    Page<Product> getAllProducts(Integer page, Integer size, Long categoryId, String search);
}
