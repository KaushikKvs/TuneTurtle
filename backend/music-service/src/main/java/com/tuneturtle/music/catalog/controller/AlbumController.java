package com.tuneturtle.music.catalog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuneturtle.music.catalog.dto.AlbumListResponse;
import com.tuneturtle.music.catalog.dto.AlbumRequest;
import com.tuneturtle.music.catalog.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addAlbum(@RequestPart("request") String request,
                                      @RequestPart("file")MultipartFile file){
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            AlbumRequest albumRequest = objectMapper.readValue(request,AlbumRequest.class);
            albumRequest.setImageFile(file);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(albumService.addAlbum(albumRequest));


        }catch (Exception e){

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    @GetMapping
    public ResponseEntity<?> listAlbums(@RequestParam(required = false) String artistId){
        try {
            if (artistId != null && !artistId.isEmpty()) {
                AlbumListResponse response = albumService.getAlbumsByArtistId(artistId);
                return ResponseEntity.ok(response);
            }
           return ResponseEntity.ok(albumService.getAllAlbums());
        }catch (Exception e){
            return ResponseEntity.ok(new AlbumListResponse(false,null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeAlbum(@PathVariable String id){
        try{
            Boolean removed = albumService.removeAlbum(id);
            if(removed){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

            }else{
                return ResponseEntity.badRequest().build();
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/like")
    public ResponseEntity<?> likeAlbum(@PathVariable String id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            
            return ResponseEntity.ok(albumService.toggleLikeAlbum(id, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
