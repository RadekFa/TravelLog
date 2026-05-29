package cz.upa.travellogbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
hlavní spouštěcí třída celého backendového systému
anotace zapíná automatickou konfiguraci a skenování komponent springu
metoda main slouží jako vstupní bod pro nastartování celé aplikace
zajišťuje inicializaci aplikačního kontextu a vestavěného serveru
*/
@SpringBootApplication
public class TravelLogBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelLogBackendApplication.class, args);
    }

}