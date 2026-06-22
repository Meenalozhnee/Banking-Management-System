package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.*;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedDeposit {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long fdId;
 @Column(nullable=false,precision=19,scale=2)
 private BigDecimal amount;
 @Column(nullable=false,precision=5,scale=2)
 private BigDecimal interestRate;
 private LocalDate startDate;
 private LocalDate maturityDate;
 @Column(precision=19,scale=2)
 private BigDecimal maturityAmount;
 @Enumerated(EnumType.STRING)
 private FdStatus status;
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="account_id")
 private Account account;
 @PrePersist void pre(){startDate=LocalDate.now();
  if(status==null)status=FdStatus.ACTIVE;
 }
}
