package com.smartcommunication.config;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.Role;
import com.smartcommunication.users.RoleRepository;
import com.smartcommunication.users.User;
import com.smartcommunication.users.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(OrganizationRepository organizationRepository,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("alex@acme.com")) {
            System.out.println("[DATA INITIALIZER] Seeding default demo organization and user account...");

            Organization org = organizationRepository.save(new Organization("Acme Corporation", "acme-corp"));

            Role adminRole = roleRepository.findByNameAndIsSystemDefaultTrue("ORG_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ORG_ADMIN", "Organization Admin", true)));

            User demoUser = new User();
            demoUser.setOrganization(org);
            demoUser.setFirstName("Alex");
            demoUser.setLastName("Morgan");
            demoUser.setEmail("alex@acme.com");
            demoUser.setPassword(passwordEncoder.encode("password123"));
            demoUser.setRole(adminRole);

            userRepository.save(demoUser);

            System.out.println("[DATA INITIALIZER] Demo user alex@acme.com / password123 successfully seeded!");
        }
    }
}
