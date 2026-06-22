package com.bank.controller;

import com.bank.entity.AuditLog;
import com.bank.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository repo;

    @GetMapping
    public List<AuditLog> getAll(Principal p) {
        return repo.findByPerformedByOrderByTimestampDesc(p.getName());
    }
}
