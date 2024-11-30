package com.example.demo.Service;

import org.springframework.stereotype.Service;

import com.example.demo.model.response.VNPayResponse;

import jakarta.servlet.http.HttpServletRequest;

@Service
public interface PaymentService {
	public VNPayResponse createVnPayPayment(HttpServletRequest request);
}





