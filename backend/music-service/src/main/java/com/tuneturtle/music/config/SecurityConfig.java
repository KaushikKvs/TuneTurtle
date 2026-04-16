package com.tuneturtle.music.config;


import com.tuneturtle.music.security.JwtAuthenticationFilter;
import com.tuneturtle.music.auth.service.AppUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    //CSRF stands for Cross-Site Request Forgery
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        auth -> auth.requestMatchers("/api/auth/login", "/api/auth/register", "/api/health").permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                // Allow public listing of content
                                .requestMatchers(HttpMethod.GET, "/api/albums", "/api/songs", "/api/users/artists").permitAll()
                                // Protect modifications
                                .requestMatchers(HttpMethod.POST, "/api/albums", "/api/songs").hasAnyRole("ADMIN", "ARTIST")
                                .requestMatchers(HttpMethod.PUT, "/api/users/profile").hasAnyRole("USER", "ADMIN", "ARTIST")
                                // Transaction endpoints - broader wildcarding
                                .requestMatchers(HttpMethod.POST, "/api/transactions/**").hasAnyRole("USER", "ADMIN", "ARTIST")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/my-subscriptions", "/api/transactions/my-purchased-songs", "/api/transactions/ownership").hasAnyRole("USER", "ADMIN", "ARTIST")
                                .requestMatchers(HttpMethod.GET, "/api/access/**").hasAnyRole("USER", "ADMIN", "ARTIST")
                                .requestMatchers("/api/transactions/earnings").hasRole("ARTIST")
                                // Relax catch-all to authenticated users
                                .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "https://*.antigravity.ai",
            "https://antigravity.ai"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authProvider);
    }
}
