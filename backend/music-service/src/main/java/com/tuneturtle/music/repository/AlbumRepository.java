package com.tuneturtle.music.catalog.repository;

import com.tuneturtle.music.catalog.document.Album;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album,String> {
}
