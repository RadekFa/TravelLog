package cz.upa.travellogbackend.controller;

import cz.upa.travellogbackend.dto.UserSettingDto;
import cz.upa.travellogbackend.model.User;
import cz.upa.travellogbackend.model.UserSetting;
import cz.upa.travellogbackend.repository.UserRepository;
import cz.upa.travellogbackend.repository.UserSettingRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// controller pro správu uživatelských nastavení
// řeší přizpůsobení aplikace jako je jazyk nebo cestovatelské cíle
@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class UserSettingController {

    private static final Logger logger = LoggerFactory.getLogger(UserSettingController.class);

    @Autowired
    private UserSettingRepository settingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserSetting> getSettings(Authentication auth) {
        logger.info("Retrieving settings for user: {}", auth.getName());
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSetting settings = settingRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    logger.info("Settings not found, creating defaults for user ID: {}", user.getId());
                    UserSetting defaultSettings = new UserSetting();
                    defaultSettings.setUser(user);
                    defaultSettings.setTravelGoal(20);
                    defaultSettings.setLanguage("en");
                    defaultSettings.setNotificationsEnabled(true);
                    defaultSettings.setProfilePicture(null);
                    return settingRepository.save(defaultSettings);
                });

        return ResponseEntity.ok(settings);
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateSettings(@Valid @RequestBody UserSettingDto dto, Authentication auth) {
        logger.info("Updating settings for user: {}", auth.getName());
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));


        UserSetting existing = settingRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserSetting newSettings = new UserSetting();
                    newSettings.setUser(user);
                    return newSettings;
                });


        existing.setTravelGoal(dto.getTravelGoal() > 0 ? dto.getTravelGoal() : 20);
        existing.setNotificationsEnabled(dto.isNotificationsEnabled());
        existing.setDarkModeEnabled(dto.isDarkModeEnabled());
        existing.setLanguage(dto.getLanguage() != null ? dto.getLanguage() : "en");
        existing.setProfilePicture(dto.getProfilePicture());

        settingRepository.save(existing);
        logger.info("Settings for user {} successfully updated.", auth.getName());
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }
}