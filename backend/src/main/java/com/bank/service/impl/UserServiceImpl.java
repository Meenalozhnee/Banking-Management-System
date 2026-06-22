package com.bank.service.impl;

import com.bank.audit.AuditService;
import com.bank.dto.request.LoginRequest;
import com.bank.dto.request.RegisterRequest;
import com.bank.dto.response.JwtResponse;
import com.bank.entity.Role;
import com.bank.entity.User;
import com.bank.exception.CustomException;
import com.bank.repository.UserRepository;
import com.bank.security.JwtTokenProvider;
import com.bank.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.bank.service.impl.EmailService;

import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwt;
    private final AuditService audit;
    private final EmailService emailService;

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[12];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @Override
    public void register(RegisterRequest r) {
        if (repo.existsByUsername(r.getUsername()) || repo.existsByEmail(r.getEmail())) {
            throw new CustomException("Username or email already exists");
        }
        String rawPassword = r.getPassword();
        if (rawPassword == null || rawPassword.isBlank()) {
            rawPassword = generateRandomPassword();
            r.setPassword(rawPassword);
        }
        User savedUser = repo.save(User.builder()
        .username(r.getUsername())
        .email(r.getEmail())
        .password(encoder.encode(r.getPassword()))
        .role(Role.CUSTOMER)
        .fullName(r.getFullName())
        .phone(r.getPhone())
        .address(r.getAddress())
        .build());

audit.log("USER_REGISTER", r.getUsername(), "Customer registration");

String emailBody = String.format(
        "Hello %s,\nYou have successfully logged in to Sorim Bank. If this was not you, please contact support immediately.\nThank you for banking with us!",
        savedUser.getFullName() != null ? savedUser.getFullName() : savedUser.getUsername()
);

emailService.sendSimpleEmail(r.getEmail(), "Bank Account Registration", emailBody);
    }

    @Override
    public JwtResponse login(LoginRequest r) {
        var auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(r.getUsername(), r.getPassword()));
        audit.log("LOGIN", r.getUsername(), "Successful login");
        return JwtResponse.builder()
                .token(jwt.generateToken(auth))
                .username(r.getUsername())
                .role(auth.getAuthorities().iterator().next().getAuthority())
                .build();
    }

    @Override
    public User profile(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new CustomException("User not found"));
    }
}
