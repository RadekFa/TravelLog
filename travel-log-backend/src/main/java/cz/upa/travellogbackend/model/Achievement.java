package cz.upa.travellogbackend.model;

import jakarta.persistence.*;

/*
entita definující parametry cestovatelského úspěchu
obsahuje název a motivační popis pro uživatele
ukládá grafickou podobu odměny ve formátu svg kódu
definuje logiku splnění pomocí typu úspěchu a požadované hodnoty
umožňuje cílit na konkrétní regiony nebo kontinenty
*/
@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String svgIcon;

    @Enumerated(EnumType.STRING)
    private AchievementType type;

    private int requirementValue;
    private String targetRegion;

    public Achievement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSvgIcon() { return svgIcon; }
    public void setSvgIcon(String svgIcon) { this.svgIcon = svgIcon; }

    public AchievementType getType() { return type; }
    public void setType(AchievementType type) { this.type = type; }

    public int getRequirementValue() { return requirementValue; }
    public void setRequirementValue(int requirementValue) { this.requirementValue = requirementValue; }

    public String getTargetRegion() { return targetRegion; }
    public void setTargetRegion(String targetRegion) { this.targetRegion = targetRegion; }
}