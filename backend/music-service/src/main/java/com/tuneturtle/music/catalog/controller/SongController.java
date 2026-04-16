package com.tuneturtle.music.catalog.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuneturtle.music.catalog.dto.SongListResponse;
import com.tuneturtle.music.catalog.dto.SongRequest;
import com.tuneturtle.music.catalog.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {


    private final SongService songService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addSong(@RequestPart("request") String requestString,
                                     @RequestPart("audio") MultipartFile audioFile,
                                     @RequestPart("image") MultipartFile imageFile){

        try{
            ObjectMapper objectMapper = new ObjectMapper();
            SongRequest songRequest = objectMapper.readValue(requestString, SongRequest.class);
            songRequest.setImageFile(imageFile);
            songRequest.setAudioFile(audioFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(songService.addSong(songRequest));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

    @GetMapping
    public ResponseEntity<?> listSongs(@RequestParam(required = false) String artistId){
        try{
            if (artistId != null && !artistId.isEmpty()) {
                return ResponseEntity.ok(songService.getSongsByArtistId(artistId));
            }
            return ResponseEntity.ok(songService.getAllSongs());
        }catch (Exception e){
            return ResponseEntity.ok(new SongListResponse(false,null
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeSong(@PathVariable String id){
         try{
             Boolean removed = songService.removeSong(id);
             if (removed){
                 return ResponseEntity.noContent().build();
             }else{
                 return ResponseEntity.badRequest().build();
             }
         }catch (Exception e){
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
         }
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<?> likeSong(@PathVariable String id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            
            return ResponseEntity.ok(songService.toggleLikeSong(id, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
