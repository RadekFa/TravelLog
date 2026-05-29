package cz.upa.travellogbackend.controller;

import cz.upa.travellogbackend.dto.AchievementDto;
import cz.upa.travellogbackend.model.User;
import cz.upa.travellogbackend.repository.UserRepository;
import cz.upa.travellogbackend.service.AchievementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

// controller pro správu cestovatelských úspěchů (achievementů)
// poskytuje api endpointy pro získání odměn uživatele
// propojuje servisní vrstvu s databází uživatelů
@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class AchievementController {

    private static final Logger logger = LoggerFactory.getLogger(AchievementController.class);
    private final AchievementService achievementService;
    private final UserRepository userRepository;

    public AchievementController(AchievementService achievementService, UserRepository userRepository) {
        this.achievementService = achievementService;
        this.userRepository = userRepository;
    }

    // endpoint pro načtení seznamu všech úspěchů aktuálního uživatele
    // kontroluje existenci autentizačního objektu principal
    // získává identitu uživatele (email) z bezpečnostního tokenu
    @GetMapping
    public ResponseEntity<List<AchievementDto>> getAchievements(Principal principal) {
        if (principal == null) {
            logger.warn("Attempt to access achievements without authentication.");
            return ResponseEntity.status(401).build();
        }

        String email = principal.getName();
        logger.info("Fetching achievements for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));

        return ResponseEntity.ok(achievementService.getAchievementsForUser(user.getId()));
    }
}