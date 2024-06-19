package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{
	public List<Role> findAll();
}
