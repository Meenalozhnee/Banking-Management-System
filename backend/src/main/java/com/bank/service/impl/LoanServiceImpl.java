package com.bank.service.impl; 
import com.bank.audit.AuditService;
import com.bank.dto.request.*;
import com.bank.dto.response.LoanResponse;
import com.bank.entity.*;
import com.bank.exception.CustomException;
import com.bank.repository.*;
import com.bank.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.*;
import java.time.LocalDateTime;
import java.util.*; 
@Service 
@RequiredArgsConstructor 
public class LoanServiceImpl implements LoanService { 
    private final UserRepository users; 
    private final LoanRepository loans; 
    private final AuditService audit; 
    public LoanResponse apply(String username,LoanRequest r){
        User u=users.findByUsername(username).orElseThrow(); 
        BigDecimal emi=emi(r.getAmount(),r.getInterestRate(),r.getTenureMonths()); 
        Loan l=loans.save(Loan.builder().user(u).loanType(r.getLoanType()).amount(r.getAmount()).interestRate(r.getInterestRate()).tenureMonths(r.getTenureMonths()).emi(emi).status(LoanStatus.PENDING).build()); 
        audit.log("LOAN_APPLY",username,"Loan "+l.getLoanId()); 
        return res(l);
    } 
    public List<LoanResponse> mine(String username){
        User u=users.findByUsername(username).orElseThrow(); 
        return loans.findByUserId(u.getId()).stream().map(this::res).toList();
    } 
    public LoanResponse decision(Long id,LoanDecisionRequest r,String admin){
        Loan l=loans.findById(id).orElseThrow(()->new CustomException("Loan not found")); 
        l.setStatus(r.getApproved()?LoanStatus.APPROVED:LoanStatus.REJECTED); 
        l.setDecisionAt(LocalDateTime.now()); 
        l.setAdminRemarks(r.getRemarks()); 
        loans.save(l); 
        audit.log("LOAN_APPROVAL",admin,"Loan "+id+" "+l.getStatus()); 
        return res(l);
    } 
    private BigDecimal emi(BigDecimal p,BigDecimal annual,int months){
        BigDecimal monthly=annual.divide(BigDecimal.valueOf(1200),10,RoundingMode.HALF_UP); 
        double r=monthly.doubleValue(); 
        double e=p.doubleValue()*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1); 
        return BigDecimal.valueOf(e).setScale(2,RoundingMode.HALF_UP);
    } 
    private LoanResponse res(Loan l){
        return LoanResponse.builder().loanId(l.getLoanId()).loanType(l.getLoanType().name()).amount(l.getAmount()).interestRate(l.getInterestRate()).emi(l.getEmi()).status(l.getStatus().name()).tenureMonths(l.getTenureMonths()).build();
    } 
}
