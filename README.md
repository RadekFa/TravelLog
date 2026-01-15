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