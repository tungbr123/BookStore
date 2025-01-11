package com.example.demo.Entity;

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
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name="Address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
	private Long id;
    
    @Column(name = "userid")
	private int userid;
    
    @Column(name = "city")
	private String city;
    
    @Column(name = "district")
	private String district;
    
    @Column(name = "ward")
	private String ward;
    
    @Column(name = "street")
	private String street;
    
    @Column(name = "apart_num")
	private String apart_num;
    
    @Column(name = "is_default")
    private int is_default;
	
}
