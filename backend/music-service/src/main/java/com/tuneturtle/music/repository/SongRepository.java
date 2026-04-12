package com.tuneturtle.music.catalog.repository;

import com.tuneturtle.music.catalog.document.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song,String> {
}
