package cz.upa.travellogbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;

/*
entita představující konkrétní záznam o navštívené zemi uživatelem
propojuje uživatelský účet s konkrétním státem z číselníku zemí
uchovává časové rozmezí cesty pomocí data příjezdu a odjezdu
obsahuje ignorování uživatele pro správnou transformaci do formátu json
slouží jako podklad pro výpočet cestovatelských statistik a úspěchů
*/
@Entity
@Table(name = "user_visited_countries")
public class UserVisitedCountry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    private LocalDate arrivalDate;
    private LocalDate departureDate;

    public UserVisitedCountry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }
    public LocalDate getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; }
    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }
}