package cz.upa.travellogbackend.dto;

import cz.upa.travellogbackend.validation.ValidTravelGoal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserSettingDto {

    @ValidTravelGoal
    private int travelGoal;

    @NotNull
    private boolean notificationsEnabled;

    @NotNull
    private boolean darkModeEnabled;

    @NotBlank
    private String language;

    private String profilePicture;

    public int getTravelGoal() { return travelGoal; }
    public void setTravelGoal(int travelGoal) { this.travelGoal = travelGoal; }
    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
    public boolean isDarkModeEnabled() { return darkModeEnabled; }
    public void setDarkModeEnabled(boolean darkModeEnabled) { this.darkModeEnabled = darkModeEnabled; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}