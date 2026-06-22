package com.bank.util; 
import java.time.LocalDateTime; 
import java.time.format.DateTimeFormatter; 
import java.util.concurrent.ThreadLocalRandom; 
public class ReferenceGenerator { 
    public static String txRef(){
        return "TXN"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))+ThreadLocalRandom.current().nextInt(1000,9999);
    } 
    public static String accountNo(){
        return "10"+System.currentTimeMillis()+ThreadLocalRandom.current().nextInt(100,999);
    } 
}
