package com.tuneturtle.music.catalog.repository;

import com.tuneturtle.music.catalog.document.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SongRepository extends MongoRepository<Song,String> {
    List<Song> findByArtistId(String artistId);
    List<Song> findByAlbum(String albumName);
}
