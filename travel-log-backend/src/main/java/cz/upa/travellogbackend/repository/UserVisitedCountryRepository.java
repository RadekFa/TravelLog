package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.UserVisitedCountry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/*
rozhraní pro přístup k datům o navštívených zemích
využívá jpa repository pro základní databázové operace
umožňuje vyhledání všech záznamů o cestách pro konkrétní id uživatele
*/
public interface UserVisitedCountryRepository extends JpaRepository<UserVisitedCountry, Long> {
    List<UserVisitedCountry> findByUserId(Long userId);
}