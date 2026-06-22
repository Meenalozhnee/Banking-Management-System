package com.bank.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.*;
@Component
public class JwtTokenProvider {
    @Value("${app.jwt.secret}")
    private String secret;
    @Value("${app.jwt.expiration-ms}")
    private long exp;
    public String generateToken(Authentication auth){Date now=new Date();
        return Jwts.builder().subject(auth.getName()).issuedAt(now).expiration(new Date(now.getTime()+exp)).signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))).compact();
    }
    public String getUsername(String token){
        return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))).build().parseSignedClaims(token).getPayload().getSubject();
    }
    public boolean validate(String token){
        try{getUsername(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }
}
