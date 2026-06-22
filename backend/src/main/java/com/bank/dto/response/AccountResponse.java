package com.bank.dto.response;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private String accountNumber;
    private String accountHolder;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private String branchName;
    private String bankName;
}
