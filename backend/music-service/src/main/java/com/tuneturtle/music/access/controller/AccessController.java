package com.tuneturtle.music.access.controller;

import com.tuneturtle.music.access.dto.AccessResponse;
import com.tuneturtle.music.access.service.AccessService;
import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/access")
@RequiredArgsConstructor
public class AccessController {

    private final AccessService accessService;
    private final UserRepository userRepository;

    @GetMapping("/check")
    public ResponseEntity<AccessResponse> checkAccess(
            @RequestParam(required = false) String userId,
            @RequestParam String contentId) {
        
        String effectiveUserId = userId;
        
        // If no userId provided, attempt to get from Security Context
        if (effectiveUserId == null || effectiveUserId.isBlank()) {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (email != null && !email.equals("anonymousUser")) {
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    effectiveUserId = user.getId();
                }
            }
        }

        if (effectiveUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(accessService.checkAccess(effectiveUserId, contentId));
    }
}
