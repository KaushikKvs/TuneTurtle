package com.tuneturtle.music.auth.service;


import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.dto.RegisterRequest;
import com.tuneturtle.music.auth.dto.UserResponse;
import com.tuneturtle.music.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserResponse registerUser(RegisterRequest request){

        //Check If Emial Already Exists
        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email Already Exists");
        }

        User.Role userRole = User.Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ARTIST")) {
            userRole = User.Role.ARTIST;
        }

        //Create new User
        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .artistName(User.Role.ARTIST.equals(userRole) ? request.getArtistName() : null)
                .genre(User.Role.ARTIST.equals(userRole) ? request.getGenre() : null)
                .bio(User.Role.ARTIST.equals(userRole) ? request.getBio() : null)
                .build();

        userRepository.save(newUser);

        return UserResponse.builder()
                .id(newUser.getId())
                .email(newUser.getEmail())
                .role(UserResponse.Role.valueOf(newUser.getRole().name()))
                .build();

    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for the email: "+email));

    }

    public java.util.List<User> findAllArtists() {
        return userRepository.findByRole(User.Role.ARTIST);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
