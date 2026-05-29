package cz.upa.travellogbackend.controller;

import cz.upa.travellogbackend.dto.UserRegistrationDto; // Import DTO
import cz.upa.travellogbackend.model.User; // Import entity
import cz.upa.travellogbackend.security.JwtUtils; // Třída pro generování tokenů
import cz.upa.travellogbackend.repository.UserRepository; // Import repozitáře
import cz.upa.travellogbackend.service.UserService; // Import servisní vrstvy
import jakarta.validation.Valid; // Anotace pro spuštění validace nad objektem
import org.slf4j.Logger; // Rozhraní pro logování
import org.slf4j.LoggerFactory; // Třída pro získání loggeru
import org.springframework.data.domain.Page; // Stránka
import org.springframework.data.domain.PageRequest; // Tvorba parametrů stránkování
import org.springframework.data.domain.Pageable; // Rozhraní pro stránkování
import org.springframework.http.ResponseEntity; // Třída tvořící plnohodnotnou HTTP odpověď
import org.springframework.security.access.prepost.PreAuthorize; // Anotace pro autorizaci rolí
import org.springframework.security.crypto.password.PasswordEncoder; // Nástroj na hesla
import org.springframework.web.bind.annotation.*; // Veškeré webové/REST anotace

import java.util.HashMap; // Implementace mapy (slovníku)
import java.util.List; // Rozhraní seznamu
import java.util.Map; // Rozhraní mapy
import java.util.TreeMap; // Implementace mapy, která udržuje klíče seřazené

/**
 * Controller vrstva obsluhující požadavky klienta týkající se správy uživatelů.
 * Implementuje principy vícevrstvé architektury předáváním business logiky Service vrstvě.
 */
@RestController // Značí, že jde o Controller a automaticky mapuje návratové hodnoty do JSON (ResponseBody)
@RequestMapping("/api/users") // Všechny endpointy v této třídě začínají na této URL
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class UserController {

    // Vytvoření loggeru pro zaznamenávání událostí (vypisují se do konzole/souboru)
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService; // Odkaz na business logiku
    private final UserRepository userRepository; // Přímý přístup do databáze (zde např. pro jednodušší dotazy v admin statistikách)
    private final PasswordEncoder passwordEncoder; // Odkaz na kryptování
    private final JwtUtils jwtUtils; // Odkaz na generátor tokenů

    /**
     * Konstruktor pro Dependency Injection bez využití Lomboku.
     */
    public UserController(UserService userService, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userService = userService; // Nastavení služby
        this.userRepository = userRepository; // Nastavení repozitáře
        this.passwordEncoder = passwordEncoder; // Nastavení encoderu
        this.jwtUtils = jwtUtils; // Nastavení utility pro JWT
    }

    @PostMapping("/login") // Očekává HTTP POST požadavek na /api/users/login
    public ResponseEntity<?> loginUser(@RequestBody User loginData) { // Tělo požadavku se namapuje do objektu User
        logger.info("Login attempt for user: {}", loginData.getEmail()); // Zaloguje pokus o přihlášení na úrovni INFO

        return userService.findByEmail(loginData.getEmail()) // Zkusí najít uživatele podle emailu
                .map(user -> { // Pokud ho najde (Optional obsahuje hodnotu)
                    if (passwordEncoder.matches(loginData.getPassword(), user.getPassword())) { // Ověří, zda čisté heslo z requestu odpovídá hashi v DB
                        String token = jwtUtils.generateToken(user.getEmail(), user.getRole()); // Vygeneruje zabezpečený JWT token
                        logger.info("Login successful for user: {}", user.getEmail()); // Zaloguje úspěch

                        // OPRAVA: Přidán registrationYear do přihlašovacího balíčku pro React
                        return ResponseEntity.ok(Map.of( // Vrací HTTP 200 OK a v těle (body) odesílá mapu
                                "token", token, // Předání tokenu pro budoucí požadavky
                                "role", user.getRole(), // Zjištění práv ve frontendu
                                "username", user.getUsername(), // Jméno pro zobrazení v UI
                                "registrationYear", user.getRegistrationYear() // Rok registrace (přidáno dodatečně)
                        ));
                    }
                    logger.warn("Invalid password attempt for user: {}", loginData.getEmail()); // Zaloguje špatné heslo jako varování
                    return ResponseEntity.status(401).body("Invalid password!"); // Vrací chybu 401 Unauthorized
                })
                .orElseGet(() -> { // Pokud uživatele nenajde (Optional je prázdný)
                    logger.warn("User not found: {}", loginData.getEmail()); // Zaloguje varování
                    return ResponseEntity.status(404).body("User not found."); // Vrací chybu 404 Not Found
                });
    }

    @PostMapping("/register") // Očekává HTTP POST požadavek na /api/users/register
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto regDto) { // @Valid spustí validace definované v DTO (např. @StrongPassword)
        logger.info("Registration request for email: {}", regDto.getEmail()); // Log pokusu o registraci

        // Zde byl dříve try-catch blok. Nyní je smazán, protože případné výjimky
        // (např. "Email is already taken!") propadnou a automaticky je odchytí náš nový GlobalExceptionHandler.

        User savedUser = userService.registerUser(regDto); // Pokusí se zaregistrovat přes službu (uložit do DB)
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole()); // Okamžitě mu vygeneruje JWT token

        // Vrací HTTP 200 a úspěšná data (uživatel je po registraci rovnou přihlášen)
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", savedUser.getRole(),
                "username", savedUser.getUsername(),
                "registrationYear", savedUser.getRegistrationYear()
        ));
    }

    // Původní metoda pro frontend (zůstává beze změny)
    @GetMapping // Výchozí HTTP GET na /api/users
    @PreAuthorize("hasRole('ADMIN')") // Přístup má POUZE uživatel s rolí ADMIN
    public List<User> getUsers(@RequestParam(required = false) String search) { // Přebírá volitelný parametr ze zprávy ?search=...
        logger.info("ADMIN: Fetching users list. Search query: {}", search); // Logování požadavku
        return userService.findAllUsers(search); // Pošle dotaz do služby a vrací prostý seznam uživatelů
    }

    /**
     * Získá stránkovaný seznam uživatelů s možností vyhledávání.
     * Tento endpoint je přístupný pouze administrátorům.
     *
     * @param search Volitelný vyhledávací řetězec (hledá se ve jméně nebo emailu).
     * @param page Číslo požadované stránky (indexováno od 0).
     * @param size Počet záznamů na jedné stránce.
     * @return Zabalena odpověď (ResponseEntity) obsahující objekt Page s uživateli a metadaty o stránkování.
     */
    // metoda pro stránkování
    @GetMapping("/paged") // GET požadavek na /api/users/paged
    @PreAuthorize("hasRole('ADMIN')") // Ochrana pro admina
    public ResponseEntity<Page<User>> getUsersPaged(
            @RequestParam(required = false) String search, // Vyhledávací klíčové slovo
            @RequestParam(defaultValue = "0") int page, // Číslo stránky (pokud chybí, je 0)
            @RequestParam(defaultValue = "10") int size) { // Velikost stránky (pokud chybí, je 10)

        logger.info("ADMIN: Fetching paged users list. Search query: {}, Page: {}, Size: {}", search, page, size); // Detailní log parametrů

        Pageable pageable = PageRequest.of(page, size); // Vytvoří stránkovací instrukci pro databázi
        Page<User> userPage = userService.findAllUsersPaged(search, pageable); // Získá požadovanou stránku dat ze služby

        return ResponseEntity.ok(userPage); // Zabalí stránku do HTTP 200 odpovědi
    }

    @GetMapping("/stats/summary") // Endpoint pro vrácení administrativních statistik
    @PreAuthorize("hasRole('ADMIN')") // Musí být admin
    public ResponseEntity<?> getAdminStats() {
        logger.info("ADMIN: Generating statistics summary"); // Zalogování generování

        long totalUsers = userRepository.count(); // Využití vestavěné JpaRepository metody pro počet uživatelů
        long totalVisits = userRepository.countTotalVisits(); // Zavolání vlastního JPQL dotazu z repozitáře

        List<Object[]> userResults = userRepository.countUsersByYear(); // Stažení agregace uživatelů po letech
        List<Object[]> visitResults = userRepository.countVisitsByYear(); // Stažení agregace návštěv po letech

        Map<String, Map<String, Object>> mergedData = new TreeMap<>(); // Vytvoření seřazené mapy pro sloučení obou statistik podle roku (klíče)

        for (Object[] row : userResults) { // Prochází výsledky uživatelů
            String year = row[0].toString(); // První prvek je rok
            Map<String, Object> entry = new HashMap<>(); // Vytvoří mapu pro daný rok
            entry.put("year", year); // Uloží rok
            entry.put("users", row[1]); // Uloží počet uživatelů v daném roce
            entry.put("visits", 0); // Zatím nastaví návštěvy na 0
            mergedData.put(year, entry); // Vloží záznam do hlavní mapy
        }

        for (Object[] row : visitResults) { // Prochází výsledky návštěv
            String year = row[0].toString(); // Získá rok
            mergedData.computeIfAbsent(year, k -> { // Pokud rok v mapě ještě neexistuje (např. v daném roce nikdo nehrál, ale někdo jel), tak ho založí
                Map<String, Object> entry = new HashMap<>();
                entry.put("year", k);
                entry.put("users", 0); // V tom případě je uživatelů nula
                return entry;
            }).put("visits", row[1]); // Přepíše hodnotu "visits" na reálný počet pro ten daný rok
        }

        return ResponseEntity.ok(Map.of( // Vrací složenou odpověď JSON
                "totalUsers", totalUsers, // Suma sumárum uživatelů
                "totalVisits", totalVisits, // Suma sumárum návštěv
                "history", mergedData.values() // Předá jen hodnoty (list objektů) z té sloučené mapy pro grafy
        ));
    }

    @DeleteMapping("/{id}") // DELETE požadavek s ID v adrese (např. /api/users/5)
    @PreAuthorize("hasRole('ADMIN')") // Funkce smazání vyhrazena pro administrátora
    public ResponseEntity<?> deleteUser(@PathVariable Long id) { // @PathVariable získá ID z adresy URL
        logger.info("ADMIN: Request to delete user ID: {}", id); // Zaloguje pokus o smazání
        return userRepository.findById(id).map(user -> { // Pokud najde uživatele podle ID (zabrání vyhození výjimky u neexistujícího)
            userService.deleteUser(id); // Zavolá službu pro samotné smazání
            logger.info("ADMIN: User ID {} deleted successfully", id); // Zaloguje úspěch
            return ResponseEntity.ok(Map.of("message", "User deleted")); // Vrátí zprávu s kódem 200
        }).orElseGet(() -> { // Pokud uživatel nebyl nalezen
            logger.warn("ADMIN: Delete failed, user ID {} not found", id); // Zaloguje problém
            return ResponseEntity.notFound().build(); // Vrací HTTP 404 (nenalezeno)
        });
    }

    @PutMapping("/{id}/role") // PUT požadavek (update) zaměřený na změnu role
    @PreAuthorize("hasRole('ADMIN')") // Pouze admin může povýšit jiného uživatele
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) { // ID z URL, data role z těla požadavku
        String newRole = payload.get("role"); // Vytáhne konkrétní text role z poslaného JSONu
        logger.info("ADMIN: Changing role for ID {} to {}", id, newRole); // Log akce

        return userRepository.findById(id).map(user -> { // Vyhledá daného uživatele v DB
            user.setRole(newRole); // Přenastaví roli v objektu
            userRepository.save(user); // Provede uložení změněné entity (update v DB)
            logger.info("ADMIN: Role updated for user ID {}", id); // Úspěšně zalogováno
            return ResponseEntity.ok(Map.of("message", "Role updated")); // Vrátí HTTP 200
        }).orElseGet(() -> { // Pokud nenalezeno
            logger.error("ADMIN: Role update failed, user ID {} not found", id); // Log jako chyba
            return ResponseEntity.notFound().build(); // Vrátí HTTP 404
        });
    }
}