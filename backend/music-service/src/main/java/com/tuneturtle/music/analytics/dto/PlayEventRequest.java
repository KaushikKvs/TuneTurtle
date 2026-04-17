package com.tuneturtle.music.analytics.dto;

import lombok.Data;

@Data
public class PlayEventRequest {
    private String songId;
    private String albumId; // Optional: helps track album engagement
    private String userId;  // Tracked for deduplication
    private String sessionId; // Fallback for anonymous users
    private String type;    // SONG or ALBUM
}
