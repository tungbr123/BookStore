package com.example.demo.Entity;

import java.sql.Date;
import java.sql.Timestamp;
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
@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
@Table(name="Orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
	private Long id;
    
    @Column(name = "userid")
	private Long userid;
    
    @Column(name = "deliveryid")
	private int deliveryid;
    
    @Column(name = "address")
	private String address;
    
    @Column(name = "phone")
	private Long phone;
    
    @Column(name = "is_paid_before")
	private int is_paid_before;
    
    @Column(name = "money_from_user")
	private Long money_from_user;
    
    @Column(name = "status")
	private String status;

    @Column(name = "date_order")
	private Timestamp date_order;
    
    @Column(name = "is_confirmed_user")
    private int is_confirmed_user;
}
