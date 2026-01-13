
export interface Entry {
  id: string;          // Unikátní ID záznamu
  text: string;        // Obsah deníkového zápisu
  date: string;        // Datum zápisu (např. 'YYYY-MM-DD')
  location?: string;   // Volitelné: Místo pořízení záznamu
}

// Definice pro hlavní entitu (Cesta)
export interface Trip {
  id: string;          // Unikátní ID cesty
  name: string;        // Název cesty (např. "Roadtrip po Balkánu")
  destination: string; // Hlavní cíl
  startDate: string;   // Datum začátku cesty
  endDate: string;     // Datum konce cesty
  entries: Entry[];    // Seznam deníkových záznamů
}