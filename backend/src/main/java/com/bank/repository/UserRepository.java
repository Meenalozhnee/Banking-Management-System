package com.bank.repository;
import com.bank.entity.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.*;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
