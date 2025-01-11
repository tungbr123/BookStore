package com.example.demo.ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Author;
import com.example.demo.Entity.Category;
import com.example.demo.Entity.Product;
import com.example.demo.Entity.Product_Author;
import com.example.demo.Entity.Product_Category;
import com.example.demo.Repository.AuthorRepository;
import com.example.demo.Repository.CategoryRepository;
import com.example.demo.Repository.ProductAuthorRepository;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.ProductCategoryRepository;
import com.example.demo.Service.ProductService;
import com.example.demo.model.response.ApiResponse;
import com.example.demo.model.response.OrderResponse;
import com.example.demo.model.response.ProductAuthorResponse;
import com.example.demo.model.response.ProductResponse;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private CategoryRepository categoryRepository;
	@Autowired
	private ProductAuthorRepository productAuthorRepository;
	@Autowired
	private AuthorRepository authorRepository;
	@Autowired
	private ProductCategoryRepository productCategoryRepository;
	
	@Override
	public ApiResponse<Object> getAllProduct() {
		try {
			List<Product> products = productRepository.findAll();
			List<ProductResponse> productResponseList = new ArrayList<>();
			for (Product product : products) {

				List<Category> categories = new ArrayList<>();
				List<Product_Category> product_categories = productCategoryRepository.findAllByProductID(product.getId());
				for(Product_Category product_category : product_categories) {
					Category category = categoryRepository.findById(product_category.getCategory_id());
					categories.add(category);
				}
				var productResponse = ProductResponse.builder().id(product.getId()).name(product.getName())
						.description(product.getDescription()).price(product.getPrice())
						.promotional_price(product.getPromotional_price()).quantity(product.getQuantity())
						.sold(product.getSold()).image(product.getImage()).list_category(categories)
						.rating(product.getRating()).build();
				productResponseList.add(productResponse);

			}
			return ApiResponse.builder().statusCode("200").data(productResponseList)
					.message("Get All Product successfully").build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").data(null).message("Failed to load product").build();
		}
	}

	@Override
	public Object getAllProductWithPaging(String filter, int size, int page) {
		Pageable pageable = PageRequest.of(page, size);

		Page<Product> productPage = productRepository.findAll(pageable);;
		int totalPages = 0;
		
		if (filter.equals("leastQuantityProducts")) {
			productPage= productRepository.findLeastQuantityProducts(pageable);
		}
		if (filter.equals("mostSellingProducts")) {
			productPage = productRepository.findTopSellingProducts(pageable);
		}
		if (filter.equals("leastSellingProducts")) {
			productPage = productRepository.findLeastSellingProducts(pageable);
		}
		if (filter.equals("mostRatingProducts")) {
			productPage = productRepository.findMostRatingProducts(pageable);
		}
		if (filter.equals("leastRatingProducts")) {
			productPage = productRepository.findLeastRatingProducts(pageable);
		}
		totalPages = productPage.getTotalPages();
		if (productPage.isEmpty()) {
			return ApiResponse.builder().statusCode("404").message("No orders found for the user.").data(null)
					.build();
		}
		try {
			List<ProductResponse> productResponseList = new ArrayList<>();
			for (Product product : productPage) {

				List<Category> categories = new ArrayList<>();
				List<Product_Category> product_categories = productCategoryRepository.findAllByProductID(product.getId());
				for(Product_Category product_category : product_categories) {
					Category category = categoryRepository.findById(product_category.getCategory_id());
					categories.add(category);
				}
				List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());
				List<String> authors_name= new ArrayList<>();
				for(Product_Author product_author : product_authors) {
					Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
					authors_name.add(author.getName());
				}
				var productResponse = ProductResponse.builder().id(product.getId()).name(product.getName())
						.description(product.getDescription()).price(product.getPrice())
						.promotional_price(product.getPromotional_price()).quantity(product.getQuantity())
						.sold(product.getSold()).image(product.getImage()).list_category(categories)
						.rating(product.getRating()).translator(product.getTranslator()).pages(product.getPages()).weight(product.getWeight())
						.published_date(product.getPublished_date()).publisher(product.getPublisher()).supplier(product.getSupplier())
						.totalPages(totalPages).author_name(authors_name).build();
				productResponseList.add(productResponse);

			}
			return ApiResponse.builder().statusCode("200").data(productResponseList)
					.message("Get All Product successfully").build();
		} catch (Exception e) {
			return ApiResponse.builder().statusCode("500").data(null).message("Failed to load products").build();
		}
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
	public ProductAuthorResponse getProductByID(Long id) {
		Product product = productRepository.findByid(id);
		ProductAuthorResponse productAuthorResponse = new ProductAuthorResponse();
		productAuthorResponse.setId(product.getId());
		productAuthorResponse.setName(product.getName());
		productAuthorResponse.setDescription(product.getDescription());
		productAuthorResponse.setPrice(product.getPrice());
		productAuthorResponse.setPromotional_price(product.getPromotional_price());
		productAuthorResponse.setQuantity(product.getQuantity());
		productAuthorResponse.setSold(product.getSold());
		productAuthorResponse.setImage(product.getImage());
		productAuthorResponse.setRating(product.getRating());
		productAuthorResponse.setTranslator(product.getTranslator());
		productAuthorResponse.setPublished_date(product.getPublished_date());
		productAuthorResponse.setPublisher(product.getPublisher());
		productAuthorResponse.setSupplier(product.getSupplier());
		productAuthorResponse.setPages(product.getPages());
		productAuthorResponse.setWeight(product.getWeight());
		List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());	
		List<String> authors_name= new ArrayList<>();
		for(Product_Author product_author : product_authors) {
			Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
			authors_name.add(author.getName());
		}
		List<Category> categories = new ArrayList<>();
		List<Product_Category> product_categories = productCategoryRepository.findAllByProductID(product.getId());
		for(Product_Category product_category : product_categories) {
			Category category = categoryRepository.findById(product_category.getCategory_id());
			categories.add(category);
		}
		productAuthorResponse.setList_category(categories);
		productAuthorResponse.setAuthor_name(authors_name);
		return productAuthorResponse;
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
			product.setPages(productDetails.getPages());
			product.setTranslator(productDetails.getTranslator());
			product.setPublisher(productDetails.getPublisher());
			product.setPublished_date(productDetails.getPublished_date());
			product.setSupplier(productDetails.getSupplier());
			product.setWeight(productDetails.getWeight());
			return productRepository.save(product);
		} else {
			throw new RuntimeException("Product not found with id " + id);
		}
	}

	@Override
	public List<ProductAuthorResponse> getTrendingProducts() {
		// TODO Auto-generated method stub
		List<Product> products = productRepository.findTop5TrendingProducts();
		List<ProductAuthorResponse> result = new ArrayList<>();
		for(Product product : products) {
			ProductAuthorResponse productAuthorResponse = new ProductAuthorResponse();
			productAuthorResponse.setId(product.getId());
			productAuthorResponse.setName(product.getName());
			productAuthorResponse.setDescription(product.getDescription());
			productAuthorResponse.setPrice(product.getPrice());
			productAuthorResponse.setPromotional_price(product.getPromotional_price());
			productAuthorResponse.setQuantity(product.getQuantity());
			productAuthorResponse.setSold(product.getSold());
			productAuthorResponse.setImage(product.getImage());
			productAuthorResponse.setRating(product.getRating());
			productAuthorResponse.setTranslator(product.getTranslator());
			productAuthorResponse.setPublished_date(product.getPublished_date());
			productAuthorResponse.setPublisher(product.getPublisher());
			productAuthorResponse.setSupplier(product.getSupplier());
			productAuthorResponse.setPages(product.getPages());
			productAuthorResponse.setWeight(product.getWeight());
			List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());
			List<String> authors_name= new ArrayList<>();
			for(Product_Author product_author : product_authors) {
				Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
				authors_name.add(author.getName());
			}
			productAuthorResponse.setAuthor_name(authors_name);
			result.add(productAuthorResponse);
		}
		return result;
	}

	@Override
	public List<ProductAuthorResponse> getBestSellingProducts() {
		// TODO Auto-generated method stub
		List<Product> products = productRepository.findTop5BestSellingProducts();
		List<ProductAuthorResponse> result = new ArrayList<>();
		for(Product product : products) {
			ProductAuthorResponse productAuthorResponse = new ProductAuthorResponse();
			productAuthorResponse.setId(product.getId());
			productAuthorResponse.setName(product.getName());
			productAuthorResponse.setDescription(product.getDescription());
			productAuthorResponse.setPrice(product.getPrice());
			productAuthorResponse.setPromotional_price(product.getPromotional_price());
			productAuthorResponse.setQuantity(product.getQuantity());
			productAuthorResponse.setSold(product.getSold());
			productAuthorResponse.setImage(product.getImage());
			productAuthorResponse.setRating(product.getRating());
			productAuthorResponse.setTranslator(product.getTranslator());
			productAuthorResponse.setPublished_date(product.getPublished_date());
			productAuthorResponse.setPublisher(product.getPublisher());
			productAuthorResponse.setSupplier(product.getSupplier());
			productAuthorResponse.setPages(product.getPages());
			productAuthorResponse.setWeight(product.getWeight());
			List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());
			List<String> authors_name= new ArrayList<>();
			for(Product_Author product_author : product_authors) {
				Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
				authors_name.add(author.getName());
			}
			productAuthorResponse.setAuthor_name(authors_name);
			result.add(productAuthorResponse);
		}
		return result;
	}

	@Override
	public List<ProductAuthorResponse> getBestDeals() {
		// TODO Auto-generated method stub
		List<Product> products = productRepository.findTop5BestDeals();
		List<ProductAuthorResponse> result = new ArrayList<>();
		for(Product product : products) {
			ProductAuthorResponse productAuthorResponse = new ProductAuthorResponse();
			productAuthorResponse.setId(product.getId());
			productAuthorResponse.setName(product.getName());
			productAuthorResponse.setDescription(product.getDescription());
			productAuthorResponse.setPrice(product.getPrice());
			productAuthorResponse.setPromotional_price(product.getPromotional_price());
			productAuthorResponse.setQuantity(product.getQuantity());
			productAuthorResponse.setSold(product.getSold());
			productAuthorResponse.setImage(product.getImage());
			productAuthorResponse.setRating(product.getRating());
			productAuthorResponse.setTranslator(product.getTranslator());
			productAuthorResponse.setPublished_date(product.getPublished_date());
			productAuthorResponse.setPublisher(product.getPublisher());
			productAuthorResponse.setSupplier(product.getSupplier());
			productAuthorResponse.setPages(product.getPages());
			productAuthorResponse.setWeight(product.getWeight());
			List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());
			List<String> authors_name= new ArrayList<>();
			for(Product_Author product_author : product_authors) {
				Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
				authors_name.add(author.getName());
			}
			productAuthorResponse.setAuthor_name(authors_name);
			result.add(productAuthorResponse);
		}
		return result;
	}

	@Override
	public Page<Product> findAll(Pageable pageable) {
		// TODO Auto-generated method stub
		return productRepository.findAll(pageable);
	}

	@Override
	public List<ProductAuthorResponse> getAllProducts(Integer page, Integer size, Long categoryId, String search) {
		System.out.println(categoryId);
		Pageable pageable = PageRequest.of(page, size);
		Page<Product> products = productRepository.findDistinctByCategoryAndSearch(categoryId, search != null ? search : "", pageable);
		int totalPages = 0;
		totalPages = products.getTotalPages();
		List<ProductAuthorResponse> result = new ArrayList<>();
		for(Product product : products) {
			ProductAuthorResponse productAuthorResponse = new ProductAuthorResponse();
			productAuthorResponse.setId(product.getId());
			productAuthorResponse.setName(product.getName());
			productAuthorResponse.setDescription(product.getDescription());
			productAuthorResponse.setPrice(product.getPrice());
			productAuthorResponse.setPromotional_price(product.getPromotional_price());
			productAuthorResponse.setQuantity(product.getQuantity());
			productAuthorResponse.setSold(product.getSold());
			productAuthorResponse.setImage(product.getImage());
			productAuthorResponse.setRating(product.getRating());
			productAuthorResponse.setTranslator(product.getTranslator());
			productAuthorResponse.setPublished_date(product.getPublished_date());
			productAuthorResponse.setPublisher(product.getPublisher());
			productAuthorResponse.setSupplier(product.getSupplier());
			productAuthorResponse.setPages(product.getPages());
			productAuthorResponse.setWeight(product.getWeight());
			List<Product_Author> product_authors = productAuthorRepository.findAllById(product.getId());

			List<String> authors_name= new ArrayList<>();
			for(Product_Author product_author : product_authors) {
				Author author = authorRepository.findAuthorById(product_author.getAuthor_id());
				authors_name.add(author.getName());
			}
			List<Category> categories = new ArrayList<>();
			List<Product_Category> product_categories = productCategoryRepository.findAllByProductID(product.getId());

			for(Product_Category product_category : product_categories) {
				Category category = categoryRepository.findById(product_category.getCategory_id());
				categories.add(category);
			}
			productAuthorResponse.setAuthor_name(authors_name);
			productAuthorResponse.setList_category(categories);
			productAuthorResponse.setTotalPages(totalPages);
			result.add(productAuthorResponse);
		}
		return result;
	}

	@Override
	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return productRepository.findAll();
	}

	@Override
	public List<Product> getAllProductsByCategory(int productid) {
		// TODO Auto-generated method stub
		return productRepository.getAllProductByCategory(productid);
	}

}
