package com.bank.service;

import com.bank.dto.request.RegisterRequest;
import com.bank.dto.request.LoginRequest;
import com.bank.dto.response.JwtResponse;
import com.bank.entity.User;

public interface UserService {
    void register(RegisterRequest r);
    JwtResponse login(LoginRequest r);
    User profile(String username);
}
