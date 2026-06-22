package com.bank.dto.response;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {
    private String accountNumber;
    private String accountHolder;
    private BigDecimal balance;
    private String accountType;
    private String bankName;
}
