package com.bank.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Simple email service used to send plain‑text notifications such as
 * registration credentials. It relies on {@code spring-boot-starter-mail}
 * and the SMTP configuration defined in {@code application.properties}.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a basic email.
     *
     * @param to      recipient address
     * @param subject email subject line
     * @param text    plain‑text body
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        // You may set a default from address in application.properties.
        mailSender.send(message);
    }
}
