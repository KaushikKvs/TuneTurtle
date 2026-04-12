package com.tuneturtle.music.catalog.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tuneturtle.music.catalog.document.Song;
import com.tuneturtle.music.catalog.dto.SongListResponse;
import com.tuneturtle.music.catalog.dto.SongRequest;
import com.tuneturtle.music.catalog.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final Cloudinary cloudinary;

    public Song addSong(SongRequest request) throws IOException {

        @SuppressWarnings("unchecked")
        Map<String,Object> audioUploadResult =
        cloudinary.uploader().upload(request.getAudioFile().getBytes(), ObjectUtils.asMap("resource_type","video"));

        @SuppressWarnings("unchecked")
        Map<String,Object> imageUploadResult =
        cloudinary.uploader().upload(request.getImageFile().getBytes(),ObjectUtils.asMap("resource_type","image"));

        Double durationInSeconds = (Double)audioUploadResult.get("duration");
        String duration = formatDuration(durationInSeconds);
        Song newSong = Song.builder()
                .name(request.getName())
                .desc(request.getDesc())
                .album(request.getAlbum())
                .image(imageUploadResult.get("secure_url").toString())
                .file(audioUploadResult.get("secure_url").toString())
                .duration(duration)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        return songRepository.save(newSong);

    }

    public SongListResponse getAllSongs(){

        return new SongListResponse(true,songRepository.findAll());
    }

    public boolean removeSong(String id){

       Song existingSong = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song Not Found."));
        songRepository.delete(existingSong);

        return true;
    }

    private String formatDuration(Double durationInSeconds){
        if (durationInSeconds == null){
            return "0.00";
        }

        int minutes = (int)(durationInSeconds / 60);
        int seconds = (int)(durationInSeconds % 60);

        return String.format("%d:%02d",minutes,seconds);
    }
}
