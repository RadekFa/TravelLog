package cz.upa.travellogbackend.service;

import cz.upa.travellogbackend.dto.UserRegistrationDto;
import cz.upa.travellogbackend.model.User;
import cz.upa.travellogbackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_ShouldSaveUserWithEncodedPassword() {
        // Arrange (Příprava)
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setEmail("radek@example.com");
        dto.setPassword("Secret123");
        dto.setFullName("Radek Fajčík");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act (Akce)
        User result = userService.registerUser(dto);

        // Assert (Ověření výsledků) [cite: 4]
        assertNotNull(result);
        assertEquals("encoded_password", result.getPassword());
        assertEquals("radek@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_ShouldThrowException_WhenEmailExists() {
        // Arrange
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setEmail("existing@example.com");

        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new User()));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }
}