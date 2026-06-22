package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long loanId;
 @Enumerated(EnumType.STRING)
 private LoanType loanType;
 @Column(nullable=false,precision=19,scale=2)
 private BigDecimal amount;
 @Column(nullable=false,precision=5,scale=2)
 private BigDecimal interestRate;
 @Column(precision=19,scale=2)
 private BigDecimal emi;
 private Integer tenureMonths;
 @Enumerated(EnumType.STRING)
 private LoanStatus status;
 private LocalDateTime appliedAt;
 private LocalDateTime decisionAt;
 private String adminRemarks;
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="user_id")
 private User user;
 @PrePersist void pre(){
  appliedAt=LocalDateTime.now();
  if(status==null)status=LoanStatus.PENDING;
 }
}
