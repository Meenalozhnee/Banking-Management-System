package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
public class FixedDepositRequest {
    @NotBlank
    private String accountNumber;
    @DecimalMin("1000.00")
    private BigDecimal amount;
    @DecimalMin("1.00")
    private BigDecimal interestRate;
    @Min(1)
    private int tenureMonths;
}
