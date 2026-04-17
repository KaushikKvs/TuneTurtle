package com.tuneturtle.music.analytics.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class DeduplicationService {

    // Cache stores a "lock" for 30 minutes per (Type:ID:User)
    // In production, this would be backed by Redis.
    private final Cache<String, Boolean> playCache = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .maximumSize(100_000)
            .build();

    /**
     * Checks if the play event is unique within the cooling window.
     * @param type SONG or ALBUM
     * @param id The entity ID
     * @param identifier userId or sessionId
     * @return true if it's a new (billable) view, false if it's a repeat
     */
    public boolean isUniquePlay(String type, String id, String identifier) {
        String key = String.format("%s:%s:%s", type, id, identifier);
        if (playCache.getIfPresent(key) != null) {
            return false;
        }
        playCache.put(key, true);
        return true;
    }
}
