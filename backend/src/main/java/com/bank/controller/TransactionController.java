package com.bank.controller;
import com.bank.dto.request.*;
import com.bank.service.impl.TransactionServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionServiceImpl service;
    @PostMapping("/{account}/deposit")
    public Object deposit(@PathVariable String account,@Valid @RequestBody AmountRequest r,Principal p){
        return service.deposit(account,r,p.getName());
    }
    @PostMapping("/{account}/withdraw")
    public Object withdraw(@PathVariable String account,@Valid @RequestBody AmountRequest r,Principal p){
        return service.withdraw(account,r,p.getName());
    }
    @PostMapping("/transfer")
    public Object transfer(@Valid @RequestBody TransferRequest r,Principal p){
        return service.transfer(r,p.getName());
    }
    @GetMapping("/{account}/history")
    public Object history(@PathVariable String account,@RequestParam(required=false)
    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,@RequestParam(required=false)
    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="10") int size,@RequestParam(defaultValue="transactionDate") String sort){
        return service.history(account,from,to,PageRequest.of(page,size,Sort.by(sort).descending()));
    }
    @GetMapping("/all")
    public Object allTransactions(Principal p, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="50") int size){
        return service.allTransactions(p.getName(), PageRequest.of(page, size, Sort.by("transactionDate").descending()));
    }
    @GetMapping("/{account}/statement.pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String account){
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=statement.pdf").contentType(MediaType.APPLICATION_PDF).body(service.statementPdf(account));
    }
}
