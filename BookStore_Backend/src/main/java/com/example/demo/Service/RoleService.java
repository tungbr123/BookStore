package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Product;
import com.example.demo.Entity.Role;

@Service
public interface RoleService {

	public List<Role> getAllRole();

}
