package com.bank.security;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository repo;
    public UserDetails loadUserByUsername(String username){
        var u=repo.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User.withUsername(u.getUsername()).password(u.getPassword()).roles(u.getRole().name()).build();
    }
}
