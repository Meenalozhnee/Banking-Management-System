package com.bank.repository;

import com.bank.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findByUserIdAndIsUsedFalse(Long userId);
    Optional<EmailOtp> findByUserIdAndOtpCodeAndIsUsedFalse(Long userId, String otpCode);
    void deleteByUserId(Long userId);
}
