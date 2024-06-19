package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.AuthenticationService;
import com.example.demo.Service.ResetPasswordService;
import com.example.demo.model.request.Auth.AuthRequest;
import com.example.demo.model.request.Auth.ChangePasswordRequest;
import com.example.demo.model.request.Auth.ConfirmEmailRequest;
import com.example.demo.model.request.Auth.RegisterRequest;
import com.example.demo.model.request.Auth.RequireTokenToChangePw;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class AuthController {
	
    @Autowired
    private  AuthenticationService authenticationService;
    @Autowired
    private  ResetPasswordService resetPasswordService;
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request){
        return new ResponseEntity<>(authenticationService.authenticate(request),HttpStatus.OK);
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        return new ResponseEntity<>(authenticationService.register(request), HttpStatus.OK);
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> requireResetPassword(@RequestBody RequireTokenToChangePw request) {
       return new ResponseEntity<>(resetPasswordService.sendEmail(request.getEmail()),HttpStatus.OK);
    }
    @PostMapping("/confirm-password")
    public ResponseEntity<?> confirmResetPassword(@RequestBody ChangePasswordRequest request) {
        return new ResponseEntity<>(resetPasswordService.confirmResetPassword(request.getToken(), request.getNewPassword()),HttpStatus.OK);
    }
}
