package com.bank.dto.response;
import lombok.*;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long transactionId;
    private String referenceNumber;
    private java.math.BigDecimal amount;
    private String transactionType;
    private java.time.LocalDateTime transactionDate;
    private String description;
    private String senderAccountNumber;
    private String receiverAccountNumber;
}
