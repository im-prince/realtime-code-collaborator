package com.prince.collab.config;

import com.prince.collab.security.JwtAuthenticationFilter;
import com.prince.collab.service.JwtService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilter(JwtService jwtService) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration =
                new FilterRegistrationBean<>(new JwtAuthenticationFilter(jwtService));

        registration.addUrlPatterns("/api/*");
        registration.setOrder(1);

        return registration;
    }
}