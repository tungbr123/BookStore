package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Product;
import com.example.demo.Service.ProductService;
import com.example.demo.model.response.ProductResponse;

@RestController
@RequestMapping("/api/product")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
    @GetMapping("/getAllProduct")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProduct();
        return ResponseEntity.ok(products);
    }
    @GetMapping("/getAllProductByPage")
    public ResponseEntity<Page<Product>> getAllProductsByPage(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/getAllProductByCategory")
    public ResponseEntity<Page<Product>> getAllProductByCategory(
        @RequestParam int page, 
        @RequestParam int size, 
        @RequestParam(required = false) Long category,
        @RequestParam(required = false) String search) {

        Page<Product> products = productService.getAllProducts(page, size, category, search);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @PostMapping("/addProduct") // Mapping for adding a new book
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        // Add the book using BookService and return a ResponseEntity with the added book and HTTP status OK
    	Product myproduct = productService.addProduct(product);
        return new ResponseEntity<>(myproduct, HttpStatus.OK);
    }
	@GetMapping("/getAllProductByName") // Mapping for retrieving all books
	public ResponseEntity<List<Product>> getAllProductByName(@RequestParam(value = "search",defaultValue = "") String search) {
		// Retrieve all books using BookService and return a ResponseEntity with the
		// list of books and HTTP status OK
		List<Product> books = productService.getAllProductByName(search);
		return new ResponseEntity<>(books, HttpStatus.OK);
	}
	@GetMapping("/getProduct")
	public ResponseEntity<Product> getProductByID(@RequestParam(value = "id") Long id) {
		// Retrieve all books using BookService and return a ResponseEntity with the
		// list of books and HTTP status OK
		Product product = productService.getProductByID(id);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }
    
    @GetMapping("/getTrendingProducts")
    public ResponseEntity<List<Product>> getTrendingProducts() {
        List<Product> products = productService.getTrendingProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/getBestsellingProducts")
    public ResponseEntity<List<Product>> getBestSellingProducts() {
        List<Product> products = productService.getBestSellingProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/getBestdealsProducts")
    public ResponseEntity<List<Product>> getBestDeals() {
        List<Product> products = productService.getBestDeals();
        return ResponseEntity.ok(products);
    }
	
}
