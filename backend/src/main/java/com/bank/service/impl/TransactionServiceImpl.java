package com.bank.service.impl; 
import com.bank.audit.AuditService;
import com.bank.dto.request.*;
import com.bank.dto.response.TransactionResponse;
import com.bank.entity.*;
import com.bank.exception.CustomException;
import com.bank.repository.*;
import com.bank.service.TransactionService;
import com.bank.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.*; 
@Service 
@RequiredArgsConstructor 
public class TransactionServiceImpl implements TransactionService { 
    private final AccountRepository accounts; 
    private final TransactionRepository txRepo; 
    private final AuditService audit; 
    private final JavaMailSender mail; 
    private final UserRepository users; 
    private Account active(String no){
        Account a=accounts.findByAccountNumber(no).orElseThrow(()->new CustomException("Account not found")); 
        if(a.getStatus()!=AccountStatus.ACTIVE) throw new CustomException("Account inactive"); 
        return a;
    } 
    @Transactional 
    public TransactionResponse deposit(String acc,AmountRequest r,String user){
        Account a=active(acc); a.setBalance(a.getBalance().add(r.getAmount())); 
        accounts.save(a); 
        var t=save(a,r.getAmount(),TransactionType.DEPOSIT,r.getDescription(),null,acc); 
        audit.log("DEPOSIT",user,acc); 
        return res(t);
    } 
    @Transactional 
    public TransactionResponse withdraw(String acc,AmountRequest r,String user){
        Account a=active(acc); 
        if(a.getBalance().compareTo(r.getAmount())<0) throw new CustomException("Insufficient balance"); 
        a.setBalance(a.getBalance().subtract(r.getAmount())); 
        accounts.save(a); 
        var t=save(a,r.getAmount(),TransactionType.WITHDRAWAL,r.getDescription(),acc,null); audit.log("WITHDRAWAL",user,acc); 
        return res(t);
    } 
    @Transactional 
    public TransactionResponse transfer(TransferRequest r,String user){ 
        if(r.getSenderAccountNumber().equals(r.getReceiverAccountNumber())) throw new CustomException("Sender and receiver cannot be same"); 
        Account s=active(r.getSenderAccountNumber()), rec=active(r.getReceiverAccountNumber()); 
        if(s.getBalance().compareTo(r.getAmount())<0) throw new CustomException("Insufficient balance"); s.setBalance(s.getBalance().subtract(r.getAmount())); 
        rec.setBalance(rec.getBalance().add(r.getAmount())); 
        accounts.save(s); 
        accounts.save(rec); 
        var t=save(s,r.getAmount(),TransactionType.TRANSFER,r.getDescription(),s.getAccountNumber(),rec.getAccountNumber()); 
        audit.log("FUND_TRANSFER",user,t.getReferenceNumber()); 
        notifyTransfer(rec.getUser().getEmail(),t.getReferenceNumber(),r.getAmount()); return res(t);
    } 
    public Page<TransactionResponse> history(String acc,LocalDateTime from,LocalDateTime to,Pageable p){
        Page<Transaction> pg=(from==null||to==null)?txRepo.findByAccountAccountNumber(acc,p):txRepo.findByAccountAccountNumberAndTransactionDateBetween(acc,from,to,p); return pg.map(this::res);
    } 
    public Page<TransactionResponse> allTransactions(String username, Pageable p){ 
        var user = users.findByUsername(username).orElseThrow(() -> new CustomException("User not found")); return txRepo.findByUserId(user.getId(), p).map(this::res);
    } 
    public byte[] statementPdf(String acc){
        return PdfGenerator.statement(acc,txRepo.findByAccountAccountNumber(acc,PageRequest.of(0,100,Sort.by("transactionDate").descending())).getContent());
    } 
    private Transaction save(Account a,BigDecimal amt,TransactionType type,String desc,String sender,String receiver){
        return txRepo.save(Transaction.builder().account(a).amount(amt).transactionType(type).referenceNumber(ReferenceGenerator.txRef()).description(desc).senderAccountNumber(sender).receiverAccountNumber(receiver).build());
    } 
    private void notifyTransfer(String to,String ref,BigDecimal amount){ 
        try{
            SimpleMailMessage m=new SimpleMailMessage(); 
            m.setTo(to); m.setSubject("Bank Transfer Received"); 
            m.setText("Transfer received. Ref: "+ref+", Amount: "+amount); 
            mail.send(m);
        }catch(Exception ignored){} 
    } 
    private TransactionResponse res(Transaction t){
        return TransactionResponse.builder().transactionId(t.getTransactionId()).referenceNumber(t.getReferenceNumber()).amount(t.getAmount()).transactionType(t.getTransactionType().name()).transactionDate(t.getTransactionDate()).description(t.getDescription()).senderAccountNumber(t.getSenderAccountNumber()).receiverAccountNumber(t.getReceiverAccountNumber()).build();
    } 
}
