package com.bank.service.impl; 
import com.bank.audit.AuditService;
import com.bank.dto.request.FixedDepositRequest;
import com.bank.dto.response.FixedDepositResponse;
import com.bank.entity.*;
import com.bank.exception.CustomException;
import com.bank.repository.*;
import com.bank.service.FixedDepositService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.LocalDate;
import java.util.*;
 @Service 
 @RequiredArgsConstructor 
 public class FixedDepositServiceImpl implements FixedDepositService { 
    private final AccountRepository accounts; 
    private final FixedDepositRepository repo; 
    private final AuditService audit; 
    private final UserRepository users; 
    @Transactional 
    public FixedDepositResponse create(FixedDepositRequest r,String user){
        Account a=accounts.findByAccountNumber(r.getAccountNumber()).orElseThrow(()->new CustomException("Account not found")); if(a.getBalance().compareTo(r.getAmount())<0) throw new CustomException("Insufficient balance for FD"); 
        a.setBalance(a.getBalance().subtract(r.getAmount())); 
        accounts.save(a); 
        BigDecimal maturity=r.getAmount().add(r.getAmount().multiply(r.getInterestRate()).multiply(BigDecimal.valueOf(r.getTenureMonths())).divide(BigDecimal.valueOf(1200),2,RoundingMode.HALF_UP)); 
        FixedDeposit fd=repo.save(FixedDeposit.builder().account(a).amount(r.getAmount()).interestRate(r.getInterestRate()).maturityDate(LocalDate.now().plusMonths(r.getTenureMonths())).maturityAmount(maturity).status(FdStatus.ACTIVE).build()); 
        audit.log("FD_CREATE",user,"FD "+fd.getFdId()); 
        return res(fd);} 
        public List<FixedDepositResponse> active(String username){
            User u=users.findByUsername(username).orElseThrow(()->new CustomException("User not found")); return repo.findByAccountUserIdAndStatus(u.getId(),FdStatus.ACTIVE).stream().map(this::res).toList();
        } 
        public List<FixedDepositResponse> active(Long userId){
            return repo.findByAccountUserIdAndStatus(userId,FdStatus.ACTIVE).stream().map(this::res).toList();
        } 
        @Transactional 
        public FixedDepositResponse close(Long fdId,String user){
            FixedDeposit fd=repo.findById(fdId).orElseThrow(()->new CustomException("FD not found")); if(LocalDate.now().isBefore(fd.getMaturityDate())) throw new CustomException("FD cannot be closed before maturity"); 
            fd.setStatus(FdStatus.CLOSED); 
            Account a=fd.getAccount(); 
            a.setBalance(a.getBalance().add(fd.getMaturityAmount())); 
            accounts.save(a); 
            repo.save(fd); 
            audit.log("FD_CLOSE",user,"FD "+fdId); 
            return res(fd);
        } 
        @Scheduled(cron="0 0 9 * * *") 
        public void maturityReminderJob(){ 
            repo.findByMaturityDateAndStatus(LocalDate.now().plusDays(1),FdStatus.ACTIVE).forEach(fd->audit.log("FD_MATURITY_REMINDER","SYSTEM","FD "+fd.getFdId()+" matures tomorrow")); 
        } 
        private FixedDepositResponse res(FixedDeposit f){
            return FixedDepositResponse.builder().fdId(f.getFdId()).amount(f.getAmount()).interestRate(f.getInterestRate()).maturityDate(f.getMaturityDate()).maturityAmount(f.getMaturityAmount()).status(f.getStatus().name()).build();
        } 
    }
