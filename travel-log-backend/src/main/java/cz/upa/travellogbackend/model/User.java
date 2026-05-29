package cz.upa.travellogbackend.model;

import jakarta.persistence.*; // Importy pro JPA (mapování na databázi)
import java.time.LocalDate; // Datový typ pro datum bez času
import java.util.ArrayList; // Implementace dynamického pole
import java.util.HashSet; // Implementace množiny (bez duplicit)
import java.util.List; // Rozhraní pro seznamy
import java.util.Set; // Rozhraní pro množiny

/*
hlavní uživatelská entita systému
zajišťuje persistenci osobních údajů a přihlašovacích informací
propojuje uživatele s jeho individuálním nastavením aplikace
spravuje kolekci získaných úspěchů a historii navštívených míst
automaticky řeší kaskádové mazání přidružených dat při smazání profilu
*/
@Entity // Definuje, že tato třída je JPA entita (bude uložena v databázi)
@Table(name = "users") // Specifikuje přesný název tabulky v databázi
public class User {

    @Id // Označuje tento atribut jako primární klíč (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Hodnota ID se bude generovat automaticky (Auto-Increment)
    private Long id; // Unikátní identifikátor uživatele v databázi

    @Column(unique = true, nullable = false) // Sloupec musí být unikátní a nesmí být prázdný (NOT NULL)
    private String email; // Přihlašovací a kontaktní email

    @Column(nullable = false) // Heslo nesmí být v databázi prázdné
    private String password; // Zahošované heslo uživatele

    private String fullName; // Celé jméno uživatele (může být null)

    @Column(unique = true, nullable = false) // Uživatelské jméno musí být unikátní a vyplněné
    private String username; // Přezdívka uživatele

    private LocalDate birthDate; // Datum narození uživatele
    private int registrationYear; // Rok registrace (slouží pro rychlejší statistiky)
    private String role = "ROLE_USER"; // Výchozí role nového uživatele je běžný uživatel

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) // Relace 1:1, změny se kaskádově propíší do nastavení
    private UserSetting settings; // Odkaz na nastavení daného uživatele

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // Relace 1:N, načítá se až když je potřeba (LAZY)
    private Set<UserAchievement> userAchievements = new HashSet<>(); // Množina dosažených úspěchů (Set zabraňuje duplicitám)

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) // Relace 1:N, kaskádové mazání návštěv při smazání uživatele
    private List<UserVisitedCountry> visitedCountries = new ArrayList<>(); // Seznam všech navštívených zemí uživatelem

    public User() {} // Prázdný konstruktor je povinný pro správné fungování JPA (Hibernate)

    // Standardní Gettery a Settery pro přístup k privátním atributům (zapouzdření)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    public int getRegistrationYear() { return registrationYear; }
    public void setRegistrationYear(int registrationYear) { this.registrationYear = registrationYear; }
    public UserSetting getSettings() { return settings; }
    public void setSettings(UserSetting settings) { this.settings = settings; }
    public Set<UserAchievement> getUserAchievements() { return userAchievements; }
    public void setUserAchievements(Set<UserAchievement> userAchievements) { this.userAchievements = userAchievements; }
    public List<UserVisitedCountry> getVisitedCountries() { return visitedCountries; }
    public void setVisitedCountries(List<UserVisitedCountry> visitedCountries) { this.visitedCountries = visitedCountries; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}