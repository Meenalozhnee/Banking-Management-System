package com.bank.controller;
import com.bank.dto.request.*;
import com.bank.service.impl.LoanServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanServiceImpl service;
    @PostMapping
    public Object apply(@Valid @RequestBody LoanRequest r,Principal p){

        return service.apply(p.getName(),r);
    }
    @GetMapping
    public Object mine(Principal p){

        return service.mine(p.getName());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/decision")
    public Object decision(@PathVariable Long id,@RequestBody LoanDecisionRequest r,Principal p){

        return service.decision(id,r,p.getName());
    }
}
