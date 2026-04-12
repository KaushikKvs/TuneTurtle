package com.tuneturtle.music.catalog.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tuneturtle.music.catalog.document.Album;
import com.tuneturtle.music.catalog.dto.AlbumListResponse;
import com.tuneturtle.music.catalog.dto.AlbumRequest;
import com.tuneturtle.music.catalog.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlbumService {

    @Autowired
    AlbumRepository albumRepository;

    private final Cloudinary cloudinary;

    public Album addAlbum(AlbumRequest request) throws IOException {

        @SuppressWarnings("unchecked")
        Map<String,Object> imageUploadResult = cloudinary.
                uploader().upload(request.getImageFile().getBytes(), ObjectUtils.asMap("resource_type","image"));

        Album newAlbum = Album.builder()
                .name(request.getName())
                .desc(request.getDesc())
                .bgColor(request.getBgColor())
                .imageUrl(imageUploadResult.get("secure_url").toString())
                .build();

        return albumRepository.save(newAlbum);
    }

    public AlbumListResponse getAllAlbums(){
        return new AlbumListResponse(true,albumRepository.findAll());
    }

    public Boolean removeAlbum(String id){
        Album existingAlbum =  albumRepository.
                findById(id).orElseThrow(() -> new RuntimeException("Album Not Found"));

        albumRepository.delete(existingAlbum);
        return true;
    }


}
