package com.bank.controller;
import com.bank.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl service;
    @GetMapping("/profile")
    public Object profile(Principal p){
        var u=service.profile(p.getName());
        u.setPassword(null);
        return u;
    }
}
