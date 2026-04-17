package com.tuneturtle.music.analytics.service;

import com.tuneturtle.music.catalog.document.Album;
import com.tuneturtle.music.catalog.document.Song;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.atomic.LongAdder;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsBatchJob {

    private final AnalyticsBuffer buffer;
    private final MongoTemplate mongoTemplate;

    // Flush to DB every 10 seconds
    @Scheduled(fixedRate = 10000)
    public void flushAnalyticsToDb() {
        Map<String, LongAdder> songBatch = buffer.flushSongViews();
        Map<String, LongAdder> albumBatch = buffer.flushAlbumViews();

        if (songBatch.isEmpty() && albumBatch.isEmpty()) {
            return;
        }

        log.info("Batch Analytics Flush: Songs={}, Albums={}", songBatch.size(), albumBatch.size());

        songBatch.forEach((songId, count) -> {
            try {
                mongoTemplate.updateFirst(
                        Query.query(Criteria.where("_id").is(songId)),
                        new Update().inc("views", count.longValue()),
                        Song.class
                );
            } catch (Exception e) {
                log.error("Failed to update song views for {}: {}", songId, e.getMessage());
            }
        });

        albumBatch.forEach((albumId, count) -> {
            try {
                mongoTemplate.updateFirst(
                        Query.query(Criteria.where("_id").is(albumId)),
                        new Update().inc("views", count.longValue()),
                        Album.class
                );
            } catch (Exception e) {
                log.error("Failed to update album views for {}: {}", albumId, e.getMessage());
            }
        });
    }
}
