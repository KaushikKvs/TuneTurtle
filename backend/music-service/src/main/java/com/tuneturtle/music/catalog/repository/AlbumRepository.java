package com.tuneturtle.music.catalog.repository;

import com.tuneturtle.music.catalog.document.Album;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AlbumRepository extends MongoRepository<Album,String> {
    List<Album> findByArtistId(String artistId);
    java.util.Optional<Album> findByName(String name);
}
