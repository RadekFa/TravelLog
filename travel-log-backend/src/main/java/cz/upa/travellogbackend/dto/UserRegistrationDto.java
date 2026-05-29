package cz.upa.travellogbackend.dto;

import cz.upa.travellogbackend.validation.StrongPassword; // Vlastní anotace pro validaci hesla
import jakarta.validation.constraints.Email; // Kontrola e-mailového formátu
import jakarta.validation.constraints.NotBlank; // Kontrola, že text není prázdný nebo plný mezer
import jakarta.validation.constraints.Size; // Kontrola délky řetězce
import java.time.LocalDate; // Datový typ pro datum

/**
 * DTO pro přenos dat při registraci nového uživatele.
 * Obsahuje standardní validace frameworku i vlastní robustní pravidla.
 */
public class UserRegistrationDto {

    @NotBlank(message = "Email address is required") // Nelze odeslat prázdný email
    @Email(message = "Please provide a valid email address") // Musí obsahovat @ a doménu
    private String email; // Emailová adresa z registračního formuláře

    @NotBlank(message = "Password is required") // Heslo nesmí chybět
    @StrongPassword // Vlastní validační mechanismus pro zajištění bezpečnosti (např. čísla, velká písmena)
    @Size(min = 8, message = "Password must be at least 8 characters long") // Heslo musí mít minimálně 8 znaků
    private String password; // Heslo v čistém textu (zahošuje se až v Service)

    @NotBlank(message = "Username is required") // Přezdívka je povinná
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters") // Omezení délky přezdívky na 3-20 znaků
    private String username; // Zvolená přezdívka

    @NotBlank(message = "Full name is required") // Jméno a příjmení je povinné
    private String fullName; // Celé jméno zadávajícího

    private LocalDate birthDate; // Volitelné datum narození (nemá validační anotaci)

    // Bezargumentový konstruktor pro Jackson (knihovna, která převádí JSON na objekty)
    public UserRegistrationDto() {}

    // Standardní Gettery a Settery pro čtení a zápis dat z JSONu
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