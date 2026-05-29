package cz.upa.travellogbackend.controller;

import cz.upa.travellogbackend.model.Country;
import cz.upa.travellogbackend.service.CountryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// controller pro správu informací o zemích
// poskytuje data pro interaktivní mapu a seznamy zemí
// komunikuje se servisní vrstvou pro získání dat z databáze
@RestController
@RequestMapping("/api/countries")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class CountryController {

    private static final Logger logger = LoggerFactory.getLogger(CountryController.class);
    private final CountryService countryService;

    // konstruktor s injektováním country servisu
    // inicializuje závislost pro logiku práce se zeměmi
    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    // endpoint pro získání všech zemí v databázi
    // vrací kompletní seznam objektů typu country
    @GetMapping
    public List<Country> getAll() {
        logger.info("Request received for all countries for map/list display.");
        return countryService.getAllCountries();
    }

    // endpoint pro vyhledání konkrétní země podle názvu
    // přijímá název země jako parametr v url cestě
    // vrací detail země nebo status 404 při neúspěchu
    @GetMapping("/{name}")
    public ResponseEntity<Country> getByName(@PathVariable String name) {
        logger.info("Searching for country details: {}", name);
        Country country = countryService.getCountryByName(name);
        if (country != null) {
            return ResponseEntity.ok(country);
        }
        logger.warn("Country named '{}' was not found in the database.", name);
        return ResponseEntity.notFound().build();
    }
}