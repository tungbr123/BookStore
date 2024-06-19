package com.example.demo.Service;

import org.springframework.stereotype.Service;

import com.example.demo.model.request.Auth.AuthRequest;
import com.example.demo.model.request.Auth.ConfirmEmailRequest;
import com.example.demo.model.request.Auth.RegisterRequest;
import com.example.demo.model.response.ApiResponse;

@Service
public interface AuthenticationService {

	ApiResponse<Object> authenticate(AuthRequest request);
	ApiResponse<Object> register(RegisterRequest request);
	String buildEmail(String name, String link);
	ApiResponse<Object> confirmEmail(ConfirmEmailRequest request);
	ApiResponse<Object> resetPassword(AuthRequest request);
	String confirmToken(String token);
	
}
