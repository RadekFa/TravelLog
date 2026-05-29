package cz.upa.travellogbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private boolean notificationsEnabled;
    private boolean darkModeEnabled;
    private int travelGoal;
    private String language;

    @Lob
    @Column(name = "profile_picture", columnDefinition = "LONGTEXT")
    private String profilePicture;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
    public int getTravelGoal() { return travelGoal; }
    public void setTravelGoal(int travelGoal) { this.travelGoal = travelGoal; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public boolean isDarkModeEnabled() { return darkModeEnabled; }
    public void setDarkModeEnabled(boolean darkModeEnabled) { this.darkModeEnabled = darkModeEnabled; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}