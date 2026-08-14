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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class AuthServiceTest {

//    test for signup hashes the password

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


//    test for duplicate email is rejected

    @Test
    void refusesSignupWhenTheEmailIsAlreadyTaken() {
        // arrange
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder);

        User existing = new User();
        existing.setEmail("prince@example.com");
        when(userRepository.findByEmail("prince@example.com"))
                .thenReturn(Optional.of(existing));

        // act + assert
        assertThatThrownBy(() ->
                authService.signup("someoneelse", "prince@example.com", "password123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already registered");

        verify(userRepository, never()).save(any(User.class));
    }

//    test for login rejects a wrong password
    @Test
    void refusesLoginWhenThePasswordIsWrong() {
        // arrange
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AuthService authService = new AuthService(userRepository, passwordEncoder);

        User existing = new User();
        existing.setEmail("prince@example.com");
        existing.setPasswordHash("the-real-hash");

        when(userRepository.findByEmail("prince@example.com"))
                .thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("wrong-password", "the-real-hash"))
                .thenReturn(false);

        // act + assert
        assertThatThrownBy(() ->
                authService.authenticate("prince@example.com", "wrong-password"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }
}