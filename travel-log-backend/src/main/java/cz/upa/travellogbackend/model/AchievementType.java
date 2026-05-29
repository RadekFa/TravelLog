package cz.upa.travellogbackend.model;

/*
výčtový typ definující různé kategorie úspěchů
celkový počet zemí jako globální milník
počet zemí navštívených v rámci konkrétního kontinentu
úspěchy spojené se speciálními geografickými regiony
měření času stráveného aktivním cestováním
*/
public enum AchievementType {
    TOTAL_COUNTRIES,
    CONTINENT_VISITED,
    SPECIFIC_REGION,
    TIME_TRAVELER
}