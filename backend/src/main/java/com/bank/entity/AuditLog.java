package com.bank.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDateTime;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
 @Id
 @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long logId;
 @Column(nullable=false)
 private String action;
 private String performedBy;
 private String details;
 private LocalDateTime timestamp;
 @PrePersist void pre(){timestamp=LocalDateTime.now();
 }
}
