package com.smartcommunication.users.dto;

import java.util.UUID;

public class UserDto {
    private UUID id;
    private UUID organizationId;
    private String organizationName;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public UserDto() {}

    public UserDto(UUID id, UUID organizationId, String organizationName, String email, String firstName, String lastName, String role) {
        this.id = id;
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
