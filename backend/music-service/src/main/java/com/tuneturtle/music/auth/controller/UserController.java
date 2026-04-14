package com.tuneturtle.music.auth.controller;

import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.repository.UserRepository;
import com.tuneturtle.music.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/artists")
    public ResponseEntity<?> getArtists() {
        try {
            var artists = userRepository.findByRole(User.Role.ARTIST).stream().map(a -> {
                return java.util.Map.of(
                        "id", a.getId(),
                        "email", a.getEmail(),
                        "artistName", a.getArtistName() != null ? a.getArtistName() : "Unknown Artist",
                        "genre", a.getGenre() != null ? a.getGenre() : "",
                        "bio", a.getBio() != null ? a.getBio() : ""
                );
            }).collect(Collectors.toList());
            return ResponseEntity.ok(artists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "User removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
