# Travel Log - Návod ke spuštění

Tento projekt je postaven na frameworku **React (v19.2.0)** v kombinaci s nástrojem **Vite** a jazykem **TypeScript**. Pro správné spuštění aplikace, náhled produkční verze a ověření testů postupujte podle následujících kroků:

### 1. Instalace závislostí
Před prvním spuštěním je nutné nainstalovat všechny potřebné balíčky (složka `node_modules`):
```bash
npm install --legacy-peer-deps 
```

### 2. Spuštění vývojového serveru
Pro spuštění aplikace ve vývojovém režimu s podporou Hot Module Replacement (HMR):
```bash
npm run dev
```

### 3. Produkční sestavení a náhled (Build & Preview)
Pro vytvoření optimalizované produkční verze a její následné lokální spuštění
```bash
npm run build
npm run preview
```

### 4. Spuštění testů (Vitest)
Projekt obsahuje 7 jednotkových testů, které ověřují klíčovou logiku aplikace:
```bash
npm test          # Spuštění v terminálu
npm run test:ui   # Spuštění v grafickém rozhraní Vitest
```

# TravelLog Backend

Backendová část aplikace **TravelLog**  postavená na jazyce Java a frameworku Spring Boot. Zajišťuje autentizaci, správu uživatelů a evidenci navštívených států.

## 1. Příprava databáze
Před spuštěním backendu je nutné mít běžící databázový MySQL server. Aplikace si tabulky vygeneruje automaticky. Výchozí přístupové údaje (lze upravit v `src/main/resources/application.properties`):
* **URL:** `jdbc:mysql://localhost:3306/travel_log_db`
* **Uživatel:** `root`
* **Heslo:** `travellog-2026`

## 2. Spuštění vývojového serveru
Pro spuštění backendu využijte připravený Maven wrapper. Otevřete terminál ve složce projektu (kde je soubor `pom.xml`) a spusťte příkaz:

```bash
# Pro Windows:
mvnw.cmd spring-boot:run

# Pro Mac/Linux:
./mvnw spring-boot:run
```
## 3. Dokumentace API (Swagger)
Projekt obsahuje automaticky generovanou a plně interaktivní dokumentaci API pomocí nástroje Swagger / OpenAPI. Slouží k přehlednému zobrazení všech dostupných endpointů, požadovaných datových struktur a možných chybových odpovědí.

Jakmile aplikace běží, dokumentace je přístupná v prohlížeči na adrese: http://localhost:8080/swagger-ui.html

Testování zabezpečených endpointů přes Swagger:

Zavolejte endpoint POST /api/users/login se svými přihlašovacími údaji.

Zkopírujte si vygenerovaný JWT token z odpovědi serveru.

Klikněte na tlačítko Authorize v horní části Swagger rozhraní, vložte token a potvrďte. Od této chvíle můžete přímo z prohlížeče testovat i endpointy vyžadující administrátorská nebo uživatelská oprávnění.

## 3. Dokumentace projektu (Architektura)

Aplikace je navržena v souladu s principy **vícevrstvé architektury**, což zajišťuje oddělení odpovědností a snadnou testovatelnost kódu:

* **Zabezpečení (Security):** Autentizace probíhá pomocí **JWT (JSON Web Token)**. API endpointy jsou chráněny a přístup k nim je řízen na základě uživatelských rolí (`ROLE_USER`, `ROLE_ADMIN`). Nastavení CORS umožňuje plynulou komunikaci s React frontendem (port 5173).
* **Controller vrstva:** Obsluhuje příchozí HTTP požadavky, validuje vstupní DTO a vrací odpovědi v jednotném formátu (`ResponseEntity`). Odchytávání chyb je centralizováno pomocí `GlobalExceptionHandler`.
* **Service vrstva:** Obsahuje hlavní business logiku aplikace (např. kontrola unikátnosti emailu a bezpečné zahošování hesel přes `BCryptPasswordEncoder`).
* **Repository vrstva (DAO):** Využívá Spring Data JPA k přístupu k MySQL databázi. Zahrnuje CRUD operace, podporu pro stránkování (`Pageable`) a složitější JPQL dotazy pro administrátorské statistiky.
* **Entity / Modely:** Třídy reprezentující datové objekty mapované přímo do databázových tabulek (např. `User`, `UserSetting`).
* **Validace:** Systém využívá standardní Spring validace doplněné o vlastní mechanismy (např. anotace pro sílu hesla a cestovatelské cíle).
* 
## 4. Testování
V projektu je implementováno testování klíčové business logiky, čímž je zajištěna stabilita aplikace. Součástí jsou jednotkové testy (např. otestování komponenty UserService), které ověřují správnost registrace uživatelů, kontrolu unikátnosti emailu a bezpečné ukládání zahashovaných hesel do databáze.

Příkazy pro spuštění testů:
Otevřete terminál ve složce backendového projektu (tam, kde se nachází soubor pom.xml) a spusťte příslušný příkaz podle vašeho operačního systému:

```bash
# Pro Windows:
mvnw.cmd test

# Pro Mac / Linux:
./mvnw test
```
