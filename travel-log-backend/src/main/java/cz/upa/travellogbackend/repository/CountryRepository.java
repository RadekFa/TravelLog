package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/*
rozhraní pro správu číselníku zemí v databázi
poskytuje metodu pro načtení detailních informací o státu podle jeho názvu
slouží jako zdroj dat pro interaktivní mapu a výběr navštívených míst
*/
public interface CountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByName(String name);
}