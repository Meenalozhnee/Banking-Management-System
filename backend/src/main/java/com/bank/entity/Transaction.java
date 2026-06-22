package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity
@Table(name="transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long transactionId;
 @Column(nullable=false,unique=true)
 private String referenceNumber;
 @Column(nullable=false,precision=19,scale=2)
 private BigDecimal amount;
 @Enumerated(EnumType.STRING)
 private TransactionType transactionType;
 private LocalDateTime transactionDate;
 private String description;
 private String senderAccountNumber;
 private String receiverAccountNumber;
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="account_id")
 private Account account;
 @PrePersist void pre(){
  transactionDate=LocalDateTime.now();
 }
}
