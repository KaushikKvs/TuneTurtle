package com.tuneturtle.music.auth.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role = Role.USER;
    private Plan plan = Plan.BASIC;

    public enum Role{
        USER, ADMIN, ARTIST
    }

    public enum Plan {
        BASIC, STANDARD, PREMIUM
    }

    private String artistName;
    private String bio;
    private String genre;

    public User() {}
    public User(String id, String email, String password, Role role, Plan plan, String artistName, String bio, String genre) {
        this.id = id; this.email = email; this.password = password; this.role = role; this.plan = plan; this.artistName = artistName; this.bio = bio; this.genre = genre;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Plan getPlan() { return plan; }
    public void setPlan(Plan plan) { this.plan = plan; }
    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private String id; private String email; private String password; private Role role; private Plan plan; private String artistName; private String bio; private String genre;
        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder plan(Plan plan) { this.plan = plan; return this; }
        public UserBuilder artistName(String artistName) { this.artistName = artistName; return this; }
        public UserBuilder bio(String bio) { this.bio = bio; return this; }
        public UserBuilder genre(String genre) { this.genre = genre; return this; }
        public User build() { return new User(id, email, password, role, plan, artistName, bio, genre); }
    }
}
