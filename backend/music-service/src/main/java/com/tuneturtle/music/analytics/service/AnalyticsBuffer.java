package com.tuneturtle.music.analytics.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

/**
 * High-concurrency buffer for aggregating view counts.
 * Reduces database write load from O(Plays) to O(Recent Unique Tracks).
 */
@Service
public class AnalyticsBuffer {

    private final Map<String, LongAdder> songViews = new ConcurrentHashMap<>();
    private final Map<String, LongAdder> albumViews = new ConcurrentHashMap<>();

    public void bufferSongPlay(String songId) {
        songViews.computeIfAbsent(songId, k -> new LongAdder()).increment();
    }

    public void bufferAlbumPlay(String albumId) {
        albumViews.computeIfAbsent(albumId, k -> new LongAdder()).increment();
    }

    public Map<String, LongAdder> flushSongViews() {
        return flush(songViews);
    }

    public Map<String, LongAdder> flushAlbumViews() {
        return flush(albumViews);
    }

    private Map<String, LongAdder> flush(Map<String, LongAdder> map) {
        synchronized (map) {
            Map<String, LongAdder> snapshot = new ConcurrentHashMap<>(map);
            map.clear();
            return snapshot;
        }
    }
}
