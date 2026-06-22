package com.bank.dto.response;
import lombok.*;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {
    private Long loanId;
    private String loanType;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal interestRate;
    private java.math.BigDecimal emi;
    private String status;
    private Integer tenureMonths;
}
