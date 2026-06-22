package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String username;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min=6)
    private String password;
    private String fullName;
    private String phone;
    private String address;
}
