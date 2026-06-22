package com.bank.config;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.*;
@Configuration
public class ModelMapperConfig {
    @Bean
    ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
