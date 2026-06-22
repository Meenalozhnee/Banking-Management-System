package com.bank.audit;
import com.bank.entity.AuditLog;
import com.bank.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository repo;
    public void log(String action,String user,String details){
        repo.save(AuditLog.builder().action(action).performedBy(user).details(details).build());
    }
}
