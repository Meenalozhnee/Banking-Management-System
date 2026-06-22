package com.bank.repository;
import com.bank.entity.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.*;
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByAccountUserIdAndStatus(Long userId, FdStatus status);
    List<FixedDeposit> findByMaturityDateAndStatus(LocalDate date, FdStatus status);
}
