# Arduino Wiki

> Ein offline-fähiges Arduino-Nachschlagewerk mit Code-Generator von Zeasy Software

## Features

- **40 Beispielprojekte** mit vollständigem Code und Erklärungen
- **Code-Generator** - Erstelle Arduino-Code durch einfache Regeln
- **Integrierte Arduino IDE** - Öffne Code direkt in der IDE
- **100% Offline** - Läuft komplett ohne Internet vom USB-Stick

## Installation

1. Gesamten Ordner auf USB-Stick kopieren
2. `ArduinoWiki.exe` starten

## Verwendung

### Wiki durchsuchen

1. Projekte nach Kategorie filtern (LED, Taster, Sensoren, etc.)
2. Nach Schwierigkeit filtern (Anfänger/Fortgeschritten)
3. Code anzeigen und in Arduino IDE öffnen

### Code generieren

1. Komponenten auswählen (LEDs, Taster, Sensoren)
2. Regeln definieren:
   - "WENN Taster1 gedrückt DANN LED1 an"
   - "WENN Lichtsensor < 300 DANN LED2 blinkt"
3. Code generieren und in Arduino IDE öffnen

## Projekt-Kategorien

| Kategorie | Beispiele |
|-----------|-----------|
| LED | Blinken, Lauflicht, RGB-Farbwechsel, Fade |
| Taster | Toggle, Morsen, Reaktionsspiel, Würfel |
| Sensoren | Lichtsensor, Temperatur, Ultraschall, PIR |
| Display | LCD Text, Messwerte anzeigen |
| Motoren | Servo, Stepper |

## Systemanforderungen

- Windows 10/11
- Ca. 100 MB freier Speicher (ohne Arduino IDE)
- Ca. 700 MB mit Arduino IDE

## Entwicklung

Gebaut mit:
- [Tauri](https://tauri.app) - Desktop Framework
- [Vite](https://vitejs.dev) - Frontend Build Tool
- Vanilla JavaScript

---

**Zeasy Software** | [zeasy.software](https://zeasy.software)
