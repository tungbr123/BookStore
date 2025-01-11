package com.example.demo.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Product;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.ProductAuthorResponse;
import com.example.demo.model.response.ProductResponse;

@Service
public interface ProductService {

	public ApiResponse<Object> getAllProduct();

	public Product addProduct(Product product);
	
	public ProductAuthorResponse getProductByID(Long id);
	
	public List<Product> getAllProductByName(String name);
	
    Product createProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    
    List<ProductAuthorResponse> getTrendingProducts();
    
    List<ProductAuthorResponse> getBestSellingProducts();
    
    List<ProductAuthorResponse> getBestDeals();
    
    List<Product> getAllProducts();
    
    Page<Product> findAll(Pageable pageable);
    
    List<ProductAuthorResponse> getAllProducts(Integer page, Integer size, Long categoryId, String search);

	public Object getAllProductWithPaging(String filter, int size, int page);

	public List<Product> getAllProductsByCategory(int productid);
}
