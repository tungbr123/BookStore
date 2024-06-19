package com.example.model.request.User;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
@Builder
@Getter
@Setter
public class UserRequest implements Serializable {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String CMND;
    private char gender;
    private int statusUser;
}

