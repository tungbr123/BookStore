package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Product;
import com.example.demo.Entity.Role;
import com.example.demo.Service.ProductService;
import com.example.demo.Service.RoleService;

@RestController
@RequestMapping("/api/role")
public class RoleController {
	
	@Autowired
	private RoleService roleService;

	@GetMapping("/getAllRole") // Mapping for retrieving all books
	public ResponseEntity<List<Role>> getAllRole() {
		// Retrieve all books using BookService and return a ResponseEntity with the
		// list of books and HTTP status OK
		List<Role> roles = roleService.getAllRole();
		if(roles.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}
}
