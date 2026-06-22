package com.bank.util; 
import com.bank.entity.Transaction; 
import com.lowagie.text.*; 
import com.lowagie.text.pdf.*; 
import java.io.*; 
import java.util.List; 
public class PdfGenerator { 
    public static byte[] statement(String account, List<Transaction> txns){ 
        try{ 
            ByteArrayOutputStream out=new ByteArrayOutputStream(); 
            Document d=new Document(); 
            PdfWriter.getInstance(d,out); 
            d.open(); 
            d.add(new Paragraph("Account Statement: "+account)); 
            for(Transaction t:txns){d.add(new Paragraph(t.getTransactionDate()+" | "+t.getTransactionType()+" | "+t.getAmount()+" | "+t.getReferenceNumber()));

            } 
            d.close(); 
            return out.toByteArray(); 
        }
        catch(Exception e){
            throw new RuntimeException(e);
        } 
    } 
}
