package com.example.demo.Service;

public interface EmailService {
    // public String sendEmail(String to, String Subject, String body, MultipartFile[] file, String[] cc);
    void send(String to, String email);

    //To-do verify update password success
    //To-do verify reset password success
}
