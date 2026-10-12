package com.carepulse.dto;

import com.carepulse.entity.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private Role role;

    public AuthResponse() {}
    public AuthResponse(String token, Long id, String fullName, String email, Role role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
