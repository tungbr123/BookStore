package com.example.demo.model.request.Auth;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequireTokenToChangePw {
    private String email;
}
