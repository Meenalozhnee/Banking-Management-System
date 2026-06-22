package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter
@Setter
public class LoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
