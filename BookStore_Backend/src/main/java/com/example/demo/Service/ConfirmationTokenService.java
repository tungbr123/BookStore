package com.example.demo.Service;




import java.util.Optional;

import com.example.demo.Entity.ConfirmationToken;
import com.example.demo.Entity._User;


public interface ConfirmationTokenService {
    void saveConfirmationToken(ConfirmationToken token);
    Optional<ConfirmationToken> getToken(String token);

    void setConfirmedAt(String token);

    _User getUser(String token);
}
