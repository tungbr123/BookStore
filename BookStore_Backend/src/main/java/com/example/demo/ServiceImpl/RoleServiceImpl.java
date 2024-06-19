package com.example.demo.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Product;
import com.example.demo.Entity.Role;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.RoleRepository;
import com.example.demo.Service.ProductService;
import com.example.demo.Service.RoleService;

@Service
public class RoleServiceImpl implements RoleService{
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Override
	public List<Role> getAllRole() {
		List<Role> roles= roleRepository.findAll();
		return roles;
	}
}
