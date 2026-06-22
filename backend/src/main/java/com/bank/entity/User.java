package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDateTime;import java.util.*;
@Entity @Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;
 @Column(nullable=false,unique=true)
 private String username;
 @Column(nullable=false,unique=true)
 private String email;
 @Column(nullable=false)
 private String password;
 @Enumerated(EnumType.STRING)
 @Column(nullable=false)
 private Role role;
    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;
 private String fullName;
 private String phone;
 private String address;
 private LocalDateTime createdAt;
 @OneToMany(mappedBy="user")
 private List<Account> accounts=new ArrayList<>();
    // Getter and setter for isVerified
    public boolean getIsVerified(){return isVerified;}
    public void setIsVerified(boolean isVerified){this.isVerified = isVerified;}
 @PrePersist void pre(){
  createdAt=LocalDateTime.now(); if(role==null) role=Role.CUSTOMER;
 }
}
