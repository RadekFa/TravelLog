package cz.upa.travellogbackend.service;

import cz.upa.travellogbackend.dto.UserRegistrationDto; // Import DTO
import cz.upa.travellogbackend.model.User; // Import modelu
import cz.upa.travellogbackend.model.UserSetting; // Import nastavení
import cz.upa.travellogbackend.repository.UserRepository; // Import repozitáře
import org.springframework.data.domain.Page; // Stránkovací objekt
import org.springframework.data.domain.Pageable; // Parametry stránkování
import org.springframework.security.crypto.password.PasswordEncoder; // Rozhraní pro hashování hesel
import org.springframework.stereotype.Service; // Značí komponentu obsahující business logiku
import org.springframework.transaction.annotation.Transactional; // Zajišťuje atomicitu databázových operací

import java.time.Year; // Třída pro práci s aktuálním rokem
import java.util.List; // Rozhraní seznamu
import java.util.Optional; // Kontejner na možnou null hodnotu

@Service // Spring z této třídy vytvoří Bean a spravuje ho v kontextu aplikace
public class UserService {

    private final UserRepository userRepository; // Odkaz na repozitář pro ukládání do DB
    private final PasswordEncoder passwordEncoder; // Nástroj pro zašifrování hesla

    // Konstruktor pro injektování závislostí (Dependency Injection)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository; // Inicializace repozitáře
        this.passwordEncoder = passwordEncoder; // Inicializace šifrátoru
    }

    /**
     * Registruje nového uživatele do systému.
     * Provádí kontrolu unikátnosti emailu, bezpečné zahošování hesla
     * a inicializaci výchozích uživatelských nastavení.
     *
     * @param regDto DTO obsahující registrační údaje od klienta.
     * @return Uložená entita User s přiřazeným ID a rolí.
     * @throws RuntimeException pokud uživatel s daným emailem již existuje.
     */
    @Transactional // Metoda se provede jako jedna databázová transakce (když selže, nic se neuloží)
    public User registerUser(UserRegistrationDto regDto) {
        // Business validace: Kontrola, zda v DB už není někdo se stejným emailem
        if (userRepository.findByEmail(regDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken!"); // Vyhození výjimky, pokud email existuje
        }

        User user = new User(); // Vytvoření nové prázdné entity uživatele
        user.setEmail(regDto.getEmail()); // Nastavení emailu z DTO
        // Zabezpečení dat: Heslo kódujeme v Service vrstvě před uložením do databáze
        user.setPassword(passwordEncoder.encode(regDto.getPassword()));
        user.setUsername(regDto.getUsername()); // Překopírování jména
        user.setFullName(regDto.getFullName()); // Překopírování celého jména
        user.setBirthDate(regDto.getBirthDate()); // Překopírování data narození
        user.setRegistrationYear(Year.now().getValue()); // Dynamické zjištění aktuálního roku
        user.setRole("ROLE_USER"); // Natvrdo nastavená výchozí role

        // OPRAVA: Přidány výchozí hodnoty pro nového uživatele, aby prošel validací
        UserSetting settings = new UserSetting(); // Vytvoření nového prázdného nastavení
        settings.setLanguage("en"); // Výchozí jazyk je angličtina
        settings.setTravelGoal(20); // Výchozí cestovatelský cíl je 20 zemí
        settings.setNotificationsEnabled(true); // Zapnutí notifikací
        settings.setUser(user); // Propojení nastavení s uživatelem (relace 1:1)
        user.setSettings(settings); // Propojení uživatele s nastavením

        return userRepository.save(user); // Finální uložení připraveného objektu do databáze
    }

    // Metoda pro získání všech uživatelů, případně s filtrováním
    public List<User> findAllUsers(String search) {
        if (search != null && !search.isEmpty()) { // Pokud byl zadán vyhledávací dotaz
            return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search); // Volá hledací metodu
        }
        return userRepository.findAll(); // Jinak vrátí úplně všechny
    }

    // Nová metoda pro stránkování (stejná logika jako nahoře, ale aplikovaná na stránky)
    public Page<User> findAllUsersPaged(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) { // Pokud uživatel něco hledá
            return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable); // Volá dotaz s pageable parametry
        }
        return userRepository.findAll(pageable); // Vrací pouze konkrétní stránku ze všech dat
    }

    // Bezpečná metoda pro nalezení uživatele podle emailu
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email); // Přeposílá dotaz na repozitář
    }

    @Transactional // Transakční provedení smazání
    public void deleteUser(Long id) {
        userRepository.deleteById(id); // Fyzické smazání záznamu z DB podle ID
    }
}