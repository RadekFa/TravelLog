package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.User; // Import entity
import org.springframework.data.domain.Page; // Objekt reprezentující jednu stránku výsledků
import org.springframework.data.domain.Pageable; // Objekt definující parametry stránkování (page, size, sort)
import org.springframework.data.jpa.repository.JpaRepository; // Poskytuje předpřipravené CRUD metody
import org.springframework.data.jpa.repository.Query; // Umožňuje psát vlastní JPQL/SQL dotazy

import java.util.List; // Rozhraní pro seznam
import java.util.Optional; // Kontejner, který řeší situace, kdy databázový záznam nemusí existovat

// Rozhraní dědí od JpaRepository, takže automaticky získává metody jako save(), findAll(), deleteById()
public interface UserRepository extends JpaRepository<User, Long> {

    // Vyhledá uživatele podle emailu (Optional zamezí NullPointerException)
    Optional<User> findByEmail(String email);

    // Vyhledá seznam uživatelů, jejichž jméno NEBO email obsahuje hledaný řetězec (nezáleží na velikosti písmen)
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);

    // Nová metoda pro stránkování (dělá to stejné jako metoda nad ní, ale vrací objekt Page na základě parametru Pageable)
    Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email, Pageable pageable);

    @Query("SELECT COUNT(uvc) FROM UserVisitedCountry uvc") // Vlastní JPQL dotaz pro spočítání všech záznamů v tabulce navštívených zemí
    long countTotalVisits(); // Metoda vrátí celkový počet

    // Agregační JPQL dotaz: Seskupí uživatele podle roku registrace a spočítá, kolik jich v daném roce přibylo
    @Query("SELECT u.registrationYear, COUNT(u) FROM User u GROUP BY u.registrationYear ORDER BY u.registrationYear ASC")
    List<Object[]> countUsersByYear(); // Vrací list polí objektů (první prvek pole je rok, druhý prvek je počet)

    // Agregační JPQL dotaz: Vyextrahuje rok z data příjezdu a spočítá návštěvy zemí po letech, seřazeno vzestupně
    @Query("SELECT YEAR(uvc.arrivalDate), COUNT(uvc) FROM UserVisitedCountry uvc GROUP BY YEAR(uvc.arrivalDate) ORDER BY YEAR(uvc.arrivalDate) ASC")
    List<Object[]> countVisitsByYear(); // Vrací výsledek podobně jako předchozí metoda
}