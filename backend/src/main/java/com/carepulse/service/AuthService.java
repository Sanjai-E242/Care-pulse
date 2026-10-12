package com.carepulse.service;

import com.carepulse.dto.AuthRequest;
import com.carepulse.dto.AuthResponse;
import com.carepulse.dto.RegisterRequest;
import com.carepulse.entity.CaregiverProfile;
import com.carepulse.entity.User;
import com.carepulse.exception.BadRequestException;
import com.carepulse.repository.CaregiverProfileRepository;
import com.carepulse.repository.UserRepository;
import com.carepulse.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       CaregiverProfileRepository caregiverProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = new User(
                req.getFullName(),
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getPhone(),
                req.getRole()
        );
        user = userRepository.save(user);

        // Auto create profile for caregivers
        CaregiverProfile profile = new CaregiverProfile(user);
        caregiverProfileRepository.save(profile);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BadRequestException("User is not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
}
