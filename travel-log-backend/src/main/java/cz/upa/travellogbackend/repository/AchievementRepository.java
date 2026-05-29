package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
repozitář definující dostupné cestovatelské milníky v aplikaci
umožňuje hromadné načítání všech existujících výzev a jejich parametrů
zajišťuje přístup k datům o požadavcích na odemknutí úspěchů
*/
@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
}