package cz.upa.travellogbackend.service;

import cz.upa.travellogbackend.model.Country;
import cz.upa.travellogbackend.repository.CountryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/*
servisní komponenta pro obsluhu dat o zemích světa
zprostředkovává komunikaci mezi repozitářem a kontrolery aplikace
poskytuje funkčnost pro načtení kompletního číselníku všech států
obsahuje metodu pro vyhledání detailních informací o zemi podle jména
zajišťuje vyhození výjimky v případě pokusu o přístup k neexistující zemi
*/
@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    public Country getCountryByName(String name) {
        return countryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Země s názvem " + name + " nebyla nalezena."));
    }
}