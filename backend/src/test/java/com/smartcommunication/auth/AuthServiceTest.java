package com.smartcommunication.auth;

import com.smartcommunication.auth.dto.AuthResponse;
import com.smartcommunication.auth.dto.RegisterRequest;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.Role;
import com.smartcommunication.users.RoleRepository;
import com.smartcommunication.users.User;
import com.smartcommunication.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private OrganizationRepository organizationRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;

    @InjectMocks private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setOrganizationName("Acme Corp");
        request.setFirstName("Alex");
        request.setLastName("Morgan");
        request.setEmail("alex@acme.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("alex@acme.com")).thenReturn(false);

        Organization org = new Organization("Acme Corp", "acme-corp");
        org.setId(UUID.randomUUID());
        when(organizationRepository.save(any(Organization.class))).thenReturn(org);

        Role adminRole = new Role("ORG_ADMIN", "Admin", true);
        when(roleRepository.findByNameAndIsSystemDefaultTrue("ORG_ADMIN")).thenReturn(Optional.of(adminRole));

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setOrganization(org);
        savedUser.setEmail("alex@acme.com");
        savedUser.setFirstName("Alex");
        savedUser.setLastName("Morgan");
        savedUser.setRole(adminRole);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(tokenProvider.generateToken(any(User.class))).thenReturn("jwt-token-123");

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token-456");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token-123", response.getAccessToken());
        assertEquals("refresh-token-456", response.getRefreshToken());
        assertEquals("alex@acme.com", response.getUser().getEmail());
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@acme.com");

        when(userRepository.existsByEmail("existing@acme.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
    }
}
