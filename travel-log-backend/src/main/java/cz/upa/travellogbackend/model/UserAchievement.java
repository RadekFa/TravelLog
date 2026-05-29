package cz.upa.travellogbackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
spojovací entita realizující vazbu mezi uživatelem a úspěchem
zaznamenává přesný okamžik získání konkrétní trofeje
umožňuje přiřazení více různých úspěchů jednomu uživateli
funguje jako historie splněných milníků v profilu cestovatele
*/
@Entity
@Table(name = "user_achievements")
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "achievement_id")
    private Achievement achievement;

    private LocalDateTime earnedAt = LocalDateTime.now();

    public UserAchievement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Achievement getAchievement() { return achievement; }
    public void setAchievement(Achievement achievement) { this.achievement = achievement; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}