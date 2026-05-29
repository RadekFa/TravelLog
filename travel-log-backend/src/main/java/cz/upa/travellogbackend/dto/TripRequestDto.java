package cz.upa.travellogbackend.dto;

import jakarta.validation.constraints.NotBlank;

/**
  přepravní objekt pro požadavek na vytvoření záznamu o cestě
 uchovává kód země a doplňkovou poznámku od uživatele
 */
public class TripRequestDto {

    // validace zajišťující, že kód země není prázdný řetězec
    @NotBlank(message = "Kód země nesmí být prázdný")
    private String countryCode;

    private String note;

    // bezparametrický konstruktor nezbytný pro knihovnu jackson
    public TripRequestDto() {
    }

    // konstruktor pro snadné vytváření instance v kódu
    public TripRequestDto(String countryCode, String note) {
        this.countryCode = countryCode;
        this.note = note;
    }

    // gettery a settery pro přístup k datům požadavku
    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}