package cz.upa.travellogbackend.dto;

import java.time.LocalDate;

/**
 dto reprezentující požadavek na evidenci návštěvy země
 obsahuje identifikátor země a časové ohraničení návštěvy
 */
public class VisitRequest {
    private Long countryId;
    private LocalDate arrivalDate;
    private LocalDate departureDate;

    // gettery a settery pro zpracování dat o návštěvě
    public Long getCountryId() { return countryId; }
    public void setCountryId(Long countryId) { this.countryId = countryId; }
    public LocalDate getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; }
    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }
}