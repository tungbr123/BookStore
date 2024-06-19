package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Category;
import com.example.demo.Entity.Product;
import com.example.demo.Repository.CategoryRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Service.ProductService;
import com.example.demo.model.response.ProductResponse;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public List<ProductResponse> getAllProduct() {
		List<Product> products = productRepository.findAll();
		List<ProductResponse> productResponseList = new ArrayList<>();
		for (Product product : products) {

			Category category = categoryRepository.findById(product.getCategory_id());
			var productResponse = ProductResponse.builder().id(product.getId()).name(product.getName())
					.description(product.getDescription()).price(product.getPrice())
					.promotional_price(product.getPromotional_price()).quantity(product.getQuantity())
					.sold(product.getSold()).image(product.getImage()).category_name(category.getName())
					.rating(product.getRating()).build();
			productResponseList.add(productResponse);

		}
		return productResponseList;
	}

	@Override
	public Product addProduct(Product product) {
		// TODO Auto-generated method stub
		return productRepository.save(product);
	}

	@Override
	public List<Product> getAllProductByName(String name) {
		List<Product> products = productRepository.searchProducts(name);
		return products;
	}

	@Override
	public Product getProductByID(Long id) {
		Product product = productRepository.findByid(id);
		return product;
	}

	@Override
	public Product createProduct(Product product) {
		// TODO Auto-generated method stub
		return productRepository.save(product);
	}

	@Override
	public Product updateProduct(Long id, Product productDetails) {
		Optional<Product> optionalProduct = productRepository.findById(id);
		if (optionalProduct.isPresent()) {
			Product product = optionalProduct.get();
			product.setName(productDetails.getName());
			product.setDescription(productDetails.getDescription());
			product.setPrice(productDetails.getPrice());
			product.setPromotional_price(productDetails.getPromotional_price());
			product.setQuantity(productDetails.getQuantity());
			product.setSold(productDetails.getSold());
			product.setImage(productDetails.getImage());
			product.setCategory_id(productDetails.getCategory_id());
			return productRepository.save(product);
		} else {
			throw new RuntimeException("Product not found with id " + id);
		}
	}

	@Override
	public List<Product> getTrendingProducts() {
		// TODO Auto-generated method stub
		return productRepository.findTop5TrendingProducts();
	}

	@Override
	public List<Product> getBestSellingProducts() {
		// TODO Auto-generated method stub
		return productRepository.findTop5BestSellingProducts();
	}

	@Override
	public List<Product> getBestDeals() {
		// TODO Auto-generated method stub
		return productRepository.findTop5BestDeals();
	}

	@Override
	public Page<Product> findAll(Pageable pageable) {
		// TODO Auto-generated method stub
		return productRepository.findAll(pageable);
	}

	@Override
	public Page<Product> getAllProducts(Integer page, Integer size, Long categoryId, String search) {
		Pageable pageable = PageRequest.of(page, size);
		return productRepository.findByCategoryAndSearch(categoryId, search != null ? search : "", pageable);
	}

	@Override
	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return productRepository.findAll();
	}

}
