package cz.upa.travellogbackend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
dočasný pomocný kontroler pro ověření funkčnosti backendu
poskytuje jednoduchý textový endpoint přístupný bez autentizace
slouží k rychlé diagnostice propojení mezi frontendem a serverem
vypisuje informaci o přijatém požadavku do systémové konzole
*/
@RestController
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/api/test")
    public String testConnection() {
        System.out.println("--- Backend: Přijat testovací požadavek! ---");
        return "Backend funguje a je propojen!";
    }
}