package com.example.demo.model.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVoucherResponse {
	private int id;
    private String code;
    private String type; 
    private double discount_value;
    private double min_order_value;
    private LocalDate start_date;
    private LocalDate end_date;
    private int usage_limit;
    private String image_voucher;
    private String status ;
    private int usage_count;
    private int user_id;
    private Long user_voucher_id;
}












