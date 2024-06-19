package com.example.model.request.User;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String CMND;
    private int statusUser;
    private int role;
}