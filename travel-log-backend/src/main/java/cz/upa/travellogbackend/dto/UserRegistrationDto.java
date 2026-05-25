package cz.upa.travellogbackend.dto;

import java.time.LocalDate;

public class UserRegistrationDto {
    private String email;
    private String password;
    private String username;
    private String fullName;
    private LocalDate birthDate;

    // Prázdný konstruktor pro Jackson
    public UserRegistrationDto() {}

    // Gettery a Settery (v IntelliJ vygeneruješ přes Alt+Insert -> Getter and Setter)
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
}