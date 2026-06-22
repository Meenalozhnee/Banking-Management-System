package com.bank.dto.request;
import com.bank.entity.LoanType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
public class LoanRequest {
    @NotNull
    private LoanType loanType;
    @DecimalMin("1000.00")
    private BigDecimal amount;
    @DecimalMin("1.00")
    private BigDecimal interestRate;
    @Min(1) private int tenureMonths;
}
