package com.tuneturtle.music.catalog.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import com.tuneturtle.music.catalog.document.Album;
import com.tuneturtle.music.catalog.dto.AlbumListResponse;
import com.tuneturtle.music.catalog.dto.AlbumRequest;
import com.tuneturtle.music.catalog.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlbumService {

    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    private final Cloudinary cloudinary;

    public Album addAlbum(AlbumRequest request) throws IOException {

        @SuppressWarnings("unchecked")
        Map<String,Object> imageUploadResult = cloudinary.
                uploader().upload(request.getImageFile().getBytes(), ObjectUtils.asMap("resource_type","image"));

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        String artistId = user != null ? user.getId() : null;

        Album newAlbum = Album.builder()
                .name(request.getName())
                .desc(request.getDesc())
                .bgColor(request.getBgColor())
                .price(request.getPrice() != null ? request.getPrice() : 0.0)
                .isFree(request.getIsFree() != null ? request.getIsFree() : (request.getPrice() == null || request.getPrice() == 0.0))
                .artistId(artistId)
                .imageUrl(imageUploadResult.get("secure_url").toString())
                .build();

        return albumRepository.save(newAlbum);
    }

    public AlbumListResponse getAllAlbums(){
        return new AlbumListResponse(true,albumRepository.findAll());
    }

    public AlbumListResponse getAlbumsByArtistId(String artistId){
        return new AlbumListResponse(true, albumRepository.findByArtistId(artistId));
    }

    public Boolean removeAlbum(String id){
        Album existingAlbum =  albumRepository.
                findById(id).orElseThrow(() -> new RuntimeException("Album Not Found"));

        albumRepository.delete(existingAlbum);
        return true;
    }

    public Album toggleLikeAlbum(String id, String userId) {
        Album album = albumRepository.findById(id).orElseThrow(() -> new RuntimeException("Album Not Found"));
        
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update();
        
        if (album.getLikedBy() != null && album.getLikedBy().contains(userId)) {
            update.pull("likedBy", userId);
        } else {
            update.addToSet("likedBy", userId);
        }
        
        return mongoTemplate.findAndModify(query, update, Album.class);
    }


}
