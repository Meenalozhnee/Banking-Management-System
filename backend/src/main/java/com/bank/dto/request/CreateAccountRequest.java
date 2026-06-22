package com.bank.dto.request;
import com.bank.entity.AccountType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
public class CreateAccountRequest {
    @NotNull
    private AccountType accountType;
    @DecimalMin("0.00")
    private BigDecimal initialDeposit;
    private String branchName;
    @NotBlank(message = "Bank name is required")
    private String bankName;
}
