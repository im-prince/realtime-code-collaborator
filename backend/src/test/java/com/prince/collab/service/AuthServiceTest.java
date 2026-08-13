package com.prince.collab.service;

import com.prince.collab.entity.User;
import com.prince.collab.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Test
    void hashesThePasswordBeforeSaving() {
        // arrange
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-version");
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));

        // act
        User saved = authService.signup("prince", "prince@example.com", "password123");

        // assert
        assertThat(saved.getPasswordHash()).isEqualTo("hashed-version");
        assertThat(saved.getPasswordHash()).isNotEqualTo("password123");
    }
}