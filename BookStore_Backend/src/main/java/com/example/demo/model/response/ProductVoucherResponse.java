package com.example.demo.model.response;

import java.math.BigDecimal;
import java.util.Date;

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
public class ProductVoucherResponse {
	private int id;
    private int product_id;
    private int voucher_id;
    private String image_voucher;
    private BigDecimal discount_value;
    private Date end_date;
    private BigDecimal min_order_value;
}
