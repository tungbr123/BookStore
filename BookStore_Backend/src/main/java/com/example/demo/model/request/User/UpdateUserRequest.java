package com.example.demo.model.request.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateUserRequest {
	private String firstname;
	private String lastname;
	private String CMND;
	private String email;
	private String phone;
	private String avatar;
}
