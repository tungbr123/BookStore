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
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name="User_Voucher")
public class User_Voucher {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;

	@Column(name="user_id")
	private int user_id;
	
	@Column(name="voucher_id")
	private int voucher_id;
	
	@Column(name="product_id")
	private int product_id;
	
	@Column(name="usage_count")
	private int usage_count;
	
    @Column(name="status")
    private String status;
}
