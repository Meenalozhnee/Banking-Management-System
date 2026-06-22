package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.LocalDateTime;import java.util.*;
@Entity
@Table(name="accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long accountId;
 @Column(nullable=false,unique=true)
 private String accountNumber;
 @Enumerated(EnumType.STRING)
 private AccountType accountType;
 @Column(nullable=false,precision=19,scale=2)
 private BigDecimal balance;
 @Enumerated(EnumType.STRING)
 private AccountStatus status;
  private String branchName;
  private String bankName;
  private LocalDateTime createdAt;
  private LocalDateTime closedAt;
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="user_id",nullable=false)
 private User user;
 @OneToMany(mappedBy="account")
 private List<Transaction> transactions=new ArrayList<>();
 @PrePersist void pre(){
  createdAt=LocalDateTime.now(); if(status==null)status=AccountStatus.ACTIVE;
  if(balance==null)balance=BigDecimal.ZERO;
 }
}
