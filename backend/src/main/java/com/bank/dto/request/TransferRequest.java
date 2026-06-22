package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
public class TransferRequest {
    @NotBlank
    private String senderAccountNumber;
    @NotBlank
    private String receiverAccountNumber;
    @DecimalMin("1.00")
    private BigDecimal amount;
    private String description;
}
