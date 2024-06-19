package com.example.demo.model.response;

import java.sql.Date;
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
    
    private String status;
    private Date dateOrder;
    private Long amountFromUser;
    private List<OrderitemResponse> orderItems;
}
