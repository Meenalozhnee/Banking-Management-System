package com.bank.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter
@Setter
public class LoanDecisionRequest {
    @NotNull
    private Boolean approved;
    private String remarks;
}
