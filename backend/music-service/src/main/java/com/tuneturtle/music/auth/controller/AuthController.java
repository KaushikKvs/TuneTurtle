package com.tuneturtle.music.auth.controller;


import com.tuneturtle.music.auth.document.User;
import com.tuneturtle.music.auth.dto.AuthRequest;
import com.tuneturtle.music.auth.dto.AuthResponse;
import com.tuneturtle.music.auth.dto.RegisterRequest;
import com.tuneturtle.music.auth.dto.UserResponse;
import com.tuneturtle.music.auth.service.AppUserDetailsService;
import com.tuneturtle.music.auth.service.UserService;
import com.tuneturtle.music.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request){
        try {
            //Authenticate the User
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));

            //Load User Details
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            User existingUser = userService.findByEmail(request.getEmail());

            //Generate JWT Token
            String token = jwtUtil.generateToken(userDetails,existingUser.getRole().name());
            return ResponseEntity.ok(new AuthResponse(token,request.getEmail(),existingUser.getRole().name(), existingUser.getId()));

        }catch (BadCredentialsException e){
            return ResponseEntity.badRequest().body("Email/Password Is Incorrect.");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        try{
            UserResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
