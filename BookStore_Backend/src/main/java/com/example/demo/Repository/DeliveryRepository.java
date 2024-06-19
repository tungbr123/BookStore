package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer>{

}
