package com.bank.repository;
import com.bank.entity.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;import java.time.*;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);
}
