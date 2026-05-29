package cz.upa.travellogbackend.controller;

import cz.upa.travellogbackend.dto.AchievementDto;
import cz.upa.travellogbackend.dto.VisitRequest;
import cz.upa.travellogbackend.model.Country;
import cz.upa.travellogbackend.model.User;
import cz.upa.travellogbackend.model.UserVisitedCountry;
import cz.upa.travellogbackend.repository.CountryRepository;
import cz.upa.travellogbackend.repository.UserRepository;
import cz.upa.travellogbackend.repository.UserVisitedCountryRepository;
import cz.upa.travellogbackend.service.AchievementService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class UserVisitedCountryController {

    private static final Logger logger = LoggerFactory.getLogger(UserVisitedCountryController.class);

    @Autowired
    private UserVisitedCountryRepository visitedCountryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private AchievementService achievementService; // PŘIDÁNO PRO VÝPOČET ACHIEVEMENTŮ

    @GetMapping("/my-visits")
    public List<UserVisitedCountry> getMyVisits(Authentication authentication) {
        logger.info("Fetching trip history for user: {}", authentication.getName());
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return visitedCountryRepository.findByUserId(user.getId());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVisit(@Valid @RequestBody VisitRequest request, Authentication authentication) {
        logger.info("User {} is adding a new visit for country ID: {}", authentication.getName(), request.getCountryId());

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        // 1. Zjistíme odemčené achievementy PŘED uložením nové cesty
        List<Long> unlockedBefore = achievementService.getAchievementsForUser(user.getId())
                .stream()
                .filter(AchievementDto::isUnlocked)
                .map(AchievementDto::getId)
                .collect(Collectors.toList());

        UserVisitedCountry visit = new UserVisitedCountry();
        visit.setUser(user);
        visit.setCountry(country);
        visit.setArrivalDate(request.getArrivalDate());
        visit.setDepartureDate(request.getDepartureDate());

        UserVisitedCountry saved = visitedCountryRepository.save(visit);

        // 2. Zjistíme odemčené achievementy PO uložení a odfiltrujeme ty, které už měl
        List<AchievementDto> newlyUnlocked = achievementService.getAchievementsForUser(user.getId())
                .stream()
                .filter(AchievementDto::isUnlocked)
                .filter(a -> !unlockedBefore.contains(a.getId()))
                .collect(Collectors.toList());

        logger.info("Visit record ID {} successfully saved. Newly unlocked achievements: {}", saved.getId(), newlyUnlocked.size());

        // 3. Vrátíme zabalenou odpověď
        Map<String, Object> response = new HashMap<>();
        response.put("visit", saved);
        response.put("newlyUnlocked", newlyUnlocked);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVisit(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        UserVisitedCountry visit = visitedCountryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getUser().getEmail().equals(userEmail)) {
            logger.error("SECURITY ALERT: User {} attempted to delete an unauthorized visit record ID {}!", userEmail, id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own visits.");
        }

        visitedCountryRepository.delete(visit);
        logger.info("User {} deleted visit record ID {}.", userEmail, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVisit(@PathVariable Long id, @Valid @RequestBody VisitRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("User {} is updating visit record ID {}.", userEmail, id);

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserVisitedCountry visit = visitedCountryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getUser().getEmail().equals(userEmail)) {
            logger.error("SECURITY ALERT: User {} attempted to edit an unauthorized visit record ID {}!", userEmail, id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own visits.");
        }

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        // 1. Zjistíme odemčené achievementy PŘED editací
        List<Long> unlockedBefore = achievementService.getAchievementsForUser(user.getId())
                .stream()
                .filter(AchievementDto::isUnlocked)
                .map(AchievementDto::getId)
                .collect(Collectors.toList());

        visit.setCountry(country);
        visit.setArrivalDate(request.getArrivalDate());
        visit.setDepartureDate(request.getDepartureDate());

        UserVisitedCountry updated = visitedCountryRepository.save(visit);

        // 2. Zjistíme odemčené achievementy PO editaci
        List<AchievementDto> newlyUnlocked = achievementService.getAchievementsForUser(user.getId())
                .stream()
                .filter(AchievementDto::isUnlocked)
                .filter(a -> !unlockedBefore.contains(a.getId()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("visit", updated);
        response.put("newlyUnlocked", newlyUnlocked);

        return ResponseEntity.ok(response);
    }
}