package com.bank.repository;
import com.bank.entity.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;import java.time.*;
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
}
