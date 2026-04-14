package com.tuneturtle.music.auth.dto;

public class UserResponse {
    private String id;
    private String email;
    private Role role;
    
    public enum Role {
        USER, ADMIN, ARTIST
    }

    public UserResponse() {}
    public UserResponse(String id, String email, Role role) { this.id = id; this.email = email; this.role = role; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static UserResponseBuilder builder() { return new UserResponseBuilder(); }
    public static class UserResponseBuilder {
        private String id; private String email; private Role role;
        public UserResponseBuilder id(String id) { this.id = id; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder role(Role role) { this.role = role; return this; }
        public UserResponse build() { return new UserResponse(id, email, role); }
    }
}
