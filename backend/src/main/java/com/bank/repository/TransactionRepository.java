package com.bank.repository;
import com.bank.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
import java.time.*;
import org.springframework.data.domain.*;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByAccountAccountNumber(String accountNumber, Pageable pageable);
    Page<Transaction> findByAccountAccountNumberAndTransactionDateBetween(String accountNumber, LocalDateTime from, LocalDateTime to, Pageable pageable);
    @Query("SELECT t FROM Transaction t WHERE t.account.id IN (SELECT a.id FROM Account a WHERE a.user.id = :userId) ORDER BY t.transactionDate DESC")
    Page<Transaction> findByUserId(@Param("userId") Long userId, Pageable pageable);
}
