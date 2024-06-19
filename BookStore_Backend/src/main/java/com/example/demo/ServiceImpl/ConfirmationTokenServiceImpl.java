package com.example.demo.ServiceImpl;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.ConfirmationToken;
import com.example.demo.Entity._User;
import com.example.demo.Repository.ConfirmationTokenRepository;
import com.example.demo.Service.ConfirmationTokenService;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {
    private final ConfirmationTokenRepository confirmationTokenRepository;
    @Override
    public void saveConfirmationToken(ConfirmationToken token) {
        confirmationTokenRepository.save(token);
    }

    @Override
    public Optional<ConfirmationToken> getToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }

    @Override
    public void setConfirmedAt(String token) {
        confirmationTokenRepository.updateConfirmedAt(
                token, LocalDateTime.now());
    }

    @Override
    public _User getUser(String token) {
        ConfirmationToken confirmationToken = confirmationTokenRepository.findByToken(token).get();
        return confirmationToken.getUser();
    }
}
