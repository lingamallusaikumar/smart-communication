package com.smartcommunication.auth;

import com.smartcommunication.auth.dto.*;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.*;
import com.smartcommunication.users.dto.UserDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Create Organization
        String slug = request.getOrganizationName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        if (organizationRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 5);
        }
        Organization org = new Organization(request.getOrganizationName(), slug);
        org = organizationRepository.save(org);

        // Find or Create Default Admin Role
        Role adminRole = roleRepository.findByNameAndIsSystemDefaultTrue("ORG_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role("ORG_ADMIN", "Organization Administrator", true);
                    return roleRepository.save(role);
                });

        // Create User
        User user = new User();
        user.setOrganization(org);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(adminRole);
        user = userRepository.save(user);

        // Generate Tokens
        String accessToken = tokenProvider.generateToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        UserDto userDto = new UserDto(
                user.getId(),
                org.getId(),
                org.getName(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                adminRole.getName()
        );

        return new AuthResponse(accessToken, refreshToken.getToken(), userDto);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        user.setLastLoginAt(ZonedDateTime.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        UserDto userDto = new UserDto(
                user.getId(),
                user.getOrganization().getId(),
                user.getOrganization().getName(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole() != null ? user.getRole().getName() : "USER"
        );

        return new AuthResponse(accessToken, refreshToken.getToken(), userDto);
    }

    private RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(ZonedDateTime.now().plusDays(7));
        return refreshTokenRepository.save(token);
    }
}
