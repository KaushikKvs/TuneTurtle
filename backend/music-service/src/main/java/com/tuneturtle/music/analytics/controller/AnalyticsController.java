package com.tuneturtle.music.analytics.controller;

import com.tuneturtle.music.analytics.dto.PlayEventRequest;
import com.tuneturtle.music.analytics.service.AnalyticsBuffer;
import com.tuneturtle.music.analytics.service.DeduplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final DeduplicationService deduplicationService;
    private final AnalyticsBuffer buffer;

    @PostMapping("/play")
    public ResponseEntity<Void> recordPlay(@RequestBody PlayEventRequest request) {
        // 1. Resolve identifier (UserId > SessionId)
        String identifier = (request.getUserId() != null && !request.getUserId().isBlank()) 
                ? request.getUserId() 
                : request.getSessionId();

        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Track Song View (if Deduplicated)
        if (request.getSongId() != null) {
            if (deduplicationService.isUniquePlay("SONG", request.getSongId(), identifier)) {
                buffer.bufferSongPlay(request.getSongId());
            }
        }

        // 3. Track Album View (if Deduplicated)
        // Album views are often more strict (e.g., once per session)
        if (request.getAlbumId() != null) {
            if (deduplicationService.isUniquePlay("ALBUM", request.getAlbumId(), identifier)) {
                buffer.bufferAlbumPlay(request.getAlbumId());
            }
        }

        return ResponseEntity.ok().build();
    }
}
