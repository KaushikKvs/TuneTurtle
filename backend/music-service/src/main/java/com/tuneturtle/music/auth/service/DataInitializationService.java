package com.tuneturtle.music.auth.service;

import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializationService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdminUser();
    }

    private void createDefaultAdminUser() {
        String adminEmail = "admin@tuneturtle.com";
        String adminPassword = "admin123";

        User adminUser = userRepository.findByEmail(adminEmail).orElse(null);

        if (adminUser == null) {
            adminUser = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(adminUser);
            log.info("Default admin user CREATED : email={}, password={}", adminEmail, adminPassword);
        } else {
            // Force update password to ensure sync with local dev expectations
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(User.Role.ADMIN);
            userRepository.save(adminUser);
            log.info("Default admin user UPDATED : email={}, password={}", adminEmail, adminPassword);
        }
    }
}
