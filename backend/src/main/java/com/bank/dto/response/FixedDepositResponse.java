package com.bank.dto.response;
import lombok.*;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FixedDepositResponse {
    private Long fdId;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal interestRate;
    private java.time.LocalDate maturityDate;
    private java.math.BigDecimal maturityAmount;
    private String status;
}
