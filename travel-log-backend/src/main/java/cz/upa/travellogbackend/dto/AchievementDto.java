package cz.upa.travellogbackend.dto;

/**
 objekt pro přenos dat o cestovatelských úspěších
  nese informace o názvu, popisu a ikoně odměny
 obsahuje stav splnění a progres uživatele k danému cíli
 */
public class AchievementDto {
    private Long id;
    private String title;
    private String description;
    private String svgIcon;
    private boolean unlocked;
    private int requirementValue;
    private int currentValue;
    private String type;

    public AchievementDto(Long id, String title, String description, String svgIcon,
                          boolean unlocked, int requirementValue, int currentValue, String type) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.svgIcon = svgIcon;
        this.unlocked = unlocked;
        this.requirementValue = requirementValue;
        this.currentValue = currentValue;
        this.type = type;
    }

    // gettery pro serializaci objektu do formátu json
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getSvgIcon() { return svgIcon; }
    public boolean isUnlocked() { return unlocked; }
    public int getRequirementValue() { return requirementValue; }
    public int getCurrentValue() { return currentValue; }
    public String getType() { return type; }
}