package com.bank.controller;
import com.bank.dto.request.FixedDepositRequest;
import com.bank.service.impl.FixedDepositServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fixed-deposits")
@RequiredArgsConstructor
public class FixedDepositController {
    private final FixedDepositServiceImpl service;
    @PostMapping
    public Object create(@Valid @RequestBody FixedDepositRequest r,Principal p){
        return service.create(r,p.getName());
    }
    @GetMapping
    public Object mine(Principal p){
        return service.active(p.getName());
    }
    @PutMapping("/{id}/close")
    public Object close(@PathVariable Long id,Principal p){

        return service.close(id,p.getName());
    }
}
