package cz.upa.travellogbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import pro vyřešení zacyklení JSONu
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/*
entita reprezentující stát v databázi
uchovává základní geografické údaje jako rozlohu a hlavní město
obsahuje odkazy na obrazové materiály a vlajky v různých formátech
udržuje seznam návštěvníků skrze vazbu na navštívené země
*/
@Entity
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private Long population;
    private Double area;
    private String capitalCity;
    private String continent;
    private String imageAvif;
    private String imageJpg;
    private String imageWebp;
    private String flag;
    private String language;
    private String currency;


    @OneToMany(mappedBy = "country")
    @JsonIgnore // Zabrání nekonečné smyčce (vazba Country -> UserVisitedCountry -> Country)
    private List<UserVisitedCountry> visitors = new ArrayList<>();

    public Country() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getPopulation() { return population; }
    public void setPopulation(Long population) { this.population = population; }
    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }
    public String getCapitalCity() { return capitalCity; }
    public void setCapitalCity(String capitalCity) { this.capitalCity = capitalCity; }
    public String getContinent() { return continent; }
    public void setContinent(String continent) { this.continent = continent; }
    public String getImageAvif() { return imageAvif; }
    public void setImageAvif(String imageAvif) { this.imageAvif = imageAvif; }
    public String getImageJpg() { return imageJpg; }
    public void setImageJpg(String imageJpg) { this.imageJpg = imageJpg; }
    public String getImageWebp() { return imageWebp; }
    public void setImageWebp(String imageWebp) { this.imageWebp = imageWebp; }
    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public List<UserVisitedCountry> getVisitors() { return visitors; }
    public void setVisitors(List<UserVisitedCountry> visitors) { this.visitors = visitors; }
}