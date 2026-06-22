package com.bank.service;
import com.bank.dto.response.BalanceResponse;
public interface AccountService {
    BalanceResponse getBalanceWithHolder(String accountNumber);
}
