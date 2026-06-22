package com.bank.controller;
import com.bank.audit.AuditService;
import com.bank.dto.request.CreateAccountRequest;
import com.bank.dto.response.BalanceResponse;
import com.bank.service.impl.AccountServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountServiceImpl service;
    private final AuditService audit;
    @PostMapping
    public Object create(@Valid @RequestBody CreateAccountRequest r, Principal p){
        return service.create(p.getName(),r);
    }
    @GetMapping
    public Object mine(Principal p){
        return service.mine(p.getName());
    }
    @GetMapping("/{accountNumber}")
    public Object get(@PathVariable String accountNumber){
        return service.get(accountNumber);
    }
    @GetMapping("/{accountNumber}/balance")
    public BalanceResponse balance(@PathVariable String accountNumber, Principal p){
        audit.log("BALANCE_CHECK", p.getName(), "Account " + accountNumber);
        return service.getBalanceWithHolder(accountNumber);
    }
    @DeleteMapping("/{accountNumber}")
    public void close(@PathVariable String accountNumber,Principal p){
        service.close(accountNumber,p.getName());
    }
}
