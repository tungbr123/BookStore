package com.example.demo.model.response;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    
    private Long userid;
    private String firstname;
    private String lastname;
    private String email;
    
    private String delivery_name;
    private int delivery_price;
    
    private String address;
    private Long phone;
    
    private int discount_value_vouchers;
    
    private String status;
    private Date date_order;
    private Long amountFromUser;
    private List<OrderitemResponse> orderItems;
    private int totalPages;
    
    private boolean overdue;
    private long daysPending;
    private String messageStatusPending;
}
