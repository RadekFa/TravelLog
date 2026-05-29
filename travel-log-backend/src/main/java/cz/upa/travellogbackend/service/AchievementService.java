package cz.upa.travellogbackend.service;

import cz.upa.travellogbackend.dto.AchievementDto;
import cz.upa.travellogbackend.model.*;
import cz.upa.travellogbackend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/*
servisní vrstva pro výpočet a správu cestovatelských úspěchů
logika vyhodnocuje nárok na odměnu na základě historie návštěv uživatele
metoda získává seznam všech dostupných výzev a aktuální data o cestách
převod na dto objekty zahrnuje výpočet aktuálního progresu pro každý milník
podporuje různé typy úkolů jako celkový počet zemí nebo návštěvu kontinentů
zajišťuje filtraci unikátních záznamů pro přesné stanovení dosažených výsledků
*/
@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserVisitedCountryRepository visitedCountryRepository;

    public AchievementService(AchievementRepository achievementRepository,
                              UserVisitedCountryRepository visitedCountryRepository) {
        this.achievementRepository = achievementRepository;
        this.visitedCountryRepository = visitedCountryRepository;
    }

    public List<AchievementDto> getAchievementsForUser(Long userId) {
        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserVisitedCountry> userVisits = visitedCountryRepository.findByUserId(userId);

        return allAchievements.stream()
                .map(acc -> mapToDto(acc, userVisits))
                .collect(Collectors.toList());
    }

    private AchievementDto mapToDto(Achievement acc, List<UserVisitedCountry> visits) {
        int current = 0;

        Set<Long> visitedCountryIds = visits.stream()
                .map(v -> v.getCountry().getId())
                .collect(Collectors.toSet());

        switch (acc.getType()) {
            case TOTAL_COUNTRIES:
                current = visitedCountryIds.size();
                break;

            case CONTINENT_VISITED:
                current = (int) visits.stream()
                        .map(UserVisitedCountry::getCountry)
                        .filter(c -> c.getContinent().equalsIgnoreCase(acc.getTargetRegion()))
                        .map(Country::getId)
                        .distinct()
                        .count();
                break;

            case SPECIFIC_REGION:
                if ("EU".equals(acc.getTargetRegion())) {
                    current = 0;
                }
                break;
        }

        boolean isUnlocked = current >= acc.getRequirementValue();

        return new AchievementDto(
                acc.getId(),
                acc.getTitle(),
                acc.getDescription(),
                acc.getSvgIcon(),
                isUnlocked,
                acc.getRequirementValue(),
                current,
                acc.getType().name()
        );
    }
}