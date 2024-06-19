package com.example.demo.model.response;

import lombok.*;


import java.util.Date;

import jakarta.persistence.Column;
@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastname;    
    private String CMND;
    private String email;
    private String phone;
    private int role;
}
