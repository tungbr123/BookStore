package com.example.demo.Service;

import com.example.demo.model.response.ApiResponse;

public interface ResetPasswordService {
    ApiResponse<Object> sendEmail(String email);
    String buildEmail(String name, String link);
    ApiResponse<Object> confirmResetPassword(String token, String newPassword);
}
