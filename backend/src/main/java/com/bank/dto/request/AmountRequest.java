package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
public class AmountRequest {
    @DecimalMin("1.00")
    private BigDecimal amount;
    private String description;
}
