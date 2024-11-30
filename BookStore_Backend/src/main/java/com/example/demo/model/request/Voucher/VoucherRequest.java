package com.example.demo.model.request.Voucher;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VoucherRequest {
	private Long id;
	private String code;
	private String type;
	private Double discount_value;
	private Double min_order_value;
	private int usage_limit;
	private LocalDate start_date;
	private LocalDate end_date;
}
