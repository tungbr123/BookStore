package com.example.demo.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name="Voucher")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
    private Long id;
    
    @Column(name="code")
    private String code;
    
    @Column(name="type")
    private String type; 
    
    @Column(name="discount_value")
    private double discount_value;
    
    @Column(name="min_order_value")
    private double min_order_value;
    
    @Column(name="start_date")
    private LocalDate start_date;
    
    @Column(name="end_date")
    private LocalDate end_date;
    
    @Column(name="created_at")
    private LocalDate create_at;
    
    @Column(name="usage_limit")
    private int usage_limit;	
    
    @Column(name="image_voucher")
    private String image_voucher;
    

    
}
