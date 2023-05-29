package com.receta.Receta.service;

import com.receta.Receta.entity.ValidationToken;
import com.receta.Receta.repository.ITokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
@Service
@AllArgsConstructor
public class TokenService {
    private final ITokenRepository tokenRepository;

    public ValidationToken save(ValidationToken validationToken){
        return this.tokenRepository.save(validationToken);
    }

    public int confirmToken(String token, LocalDateTime date ) {
        return  tokenRepository.updateConfirmedAt(token,date);
    }

    public Optional<ValidationToken> findByToken(String token){
        return tokenRepository.findByToken(token);
    }

}
