package com.bank.controller;
import com.bank.dto.request.*;
import com.bank.entity.User;
import com.bank.repository.UserRepository;
import com.bank.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserServiceImpl service;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r){
        service.register(r);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registered successfully"));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest r){

        return ResponseEntity.ok(service.login(r));
    }
}
