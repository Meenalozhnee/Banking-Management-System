package com.bank.service.impl;

import com.bank.audit.AuditService;
import com.bank.dto.request.CreateAccountRequest;
import com.bank.dto.response.AccountResponse;
import com.bank.dto.response.BalanceResponse;
import com.bank.entity.*;
import com.bank.exception.CustomException;
import com.bank.repository.*;
import com.bank.service.AccountService;
import com.bank.util.ReferenceGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final UserRepository users;
    private final AccountRepository accounts;
    private final AuditService audit;

    @Transactional
    public AccountResponse create(String username, CreateAccountRequest r) {
        User u = users.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found: " + username));
        Account a = accounts.save(Account.builder()
            .user(u)
            .accountNumber(ReferenceGenerator.accountNo())
            .accountType(r.getAccountType())
            .balance(r.getInitialDeposit() == null ? BigDecimal.ZERO : r.getInitialDeposit())
            .branchName(r.getBranchName())
            .bankName(r.getBankName())
            .status(AccountStatus.ACTIVE)
            .build());
        log.info("Created account {} for user {} at bank {}", a.getAccountNumber(), username, r.getBankName());
        audit.log("ACCOUNT_CREATE", username, "Account " + a.getAccountNumber());
        return toRes(a);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> mine(String username) {
        log.debug("Fetching accounts for user: {}", username);
        Optional<User> userOpt = users.findByUsername(username);
        if (userOpt.isEmpty()) {
            log.warn("User not found: {}", username);
            return Collections.emptyList();
        }
        User u = userOpt.get();
        List<Account> accountList = accounts.findByUserId(u.getId());
        log.info("Found {} accounts for user {}", accountList.size(), username);
        return accountList.stream().map(this::toRes).toList();
    }

    @Transactional(readOnly = true)
    public AccountResponse get(String no) {
        return toRes(findActive(no));
    }

    @Transactional(readOnly = true)
    public BalanceResponse getBalanceWithHolder(String accountNumber) {
        Account a = findActive(accountNumber);
        String holder = a.getUser().getFullName();
        log.info("Balance check for account {} held by {}", accountNumber, holder);
        return BalanceResponse.builder()
            .accountNumber(a.getAccountNumber())
            .accountHolder(holder)
            .balance(a.getBalance())
            .accountType(a.getAccountType().name())
            .bankName(a.getBankName())
            .build();
    }

    @Transactional
    public void close(String no, String username) {
        Account a = findActive(no);
        a.setStatus(AccountStatus.CLOSED);
        accounts.save(a);
        log.info("Closed account {} by {}", no, username);
        audit.log("ACCOUNT_CLOSE", username, no);
    }

    public Account findActive(String no) {
        Account a = accounts.findByAccountNumber(no)
            .orElseThrow(() -> new CustomException("Account not found: " + no));
        if (a.getStatus() != AccountStatus.ACTIVE)
            throw new CustomException("Account is not active: " + no);
        return a;
    }

    private AccountResponse toRes(Account a) {
        return AccountResponse.builder()
            .accountNumber(a.getAccountNumber())
            .accountHolder(a.getUser().getFullName())
            .accountType(a.getAccountType().name())
            .balance(a.getBalance())
            .status(a.getStatus().name())
            .branchName(a.getBranchName())
            .bankName(a.getBankName())
            .build();
    }
}
