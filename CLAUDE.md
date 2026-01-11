# Arduino Wiki - Zeasy Software

## Projektübersicht

Offline-fähiges Arduino-Wiki als Tauri Desktop-App für Windows. Wird während Klausuren vom USB-Stick verwendet.

## Status

- [x] 40 Projekte in `data/projects.json` definiert
- [x] 40 Arduino-Lösungen in `solutions/*.ino` erstellt
- [x] Zeasy Software Logos in Root (`logo.svg`, `logo_text_horizontal.svg`, `logo_text_vertical.svg`)
- [x] Portable Arduino IDE in `arduino-ide/`
- [ ] Tauri App erstellen
- [ ] Frontend (Vite + Vanilla JS)
- [ ] Code-Generator implementieren

## Tech Stack

- **Framework:** Tauri v2
- **Frontend:** Vite + Vanilla JS (kein React/Vue nötig)
- **Styling:** Custom CSS mit Zeasy-Branding
- **Backend:** Rust (Tauri)

## Farbschema (Zeasy Software)

```css
--primary-dark: #6e2ad8;    /* Violett */
--primary: #8d19c9;         /* Lila */
--accent: #fb4ced;          /* Pink */
--accent-bright: #fe4eee;   /* Neon-Pink */
--text: #ffffff;            /* Weiß */
--bg-dark: #0d0d14;         /* Hintergrund */
--bg-card: #1a1a2e;         /* Card-Hintergrund */
```

## Features

### 1. Wiki-Bereich
- 40 Projekte durchsuchen/filtern
- Nach Kategorie: LED, Taster, Sensoren, Display, Motoren
- Nach Schwierigkeit: Anfänger, Fortgeschritten
- Code anzeigen + in Arduino IDE öffnen

### 2. Code-Generator
Regelbasierter Generator für Arduino-Code:

**Komponenten (aus Projekten extrahiert):**

OUTPUTS:
- LED (1-7x, einzelne Pins)
- RGB-LED (3 PWM-Pins)
- Piezo-Summer
- Relais
- Servomotor
- Stepper-Motor
- LCD 16x2

INPUTS:
- Taster (1-3x)
- Potentiometer (analog)
- LDR/Lichtsensor (analog)
- TMP36/Temperatursensor (analog)
- PIR/Bewegungsmelder (digital)
- HC-SR04/Ultraschall (digital)
- Joystick (2x analog + 1x digital)

**Regel-Syntax:**
```
WENN [Bedingung] DANN [Aktion]
```

Beispiel:
- WENN kein Taster gedrückt → LED an
- WENN Taster1 gedrückt → LED blinkt
- WENN Taster1 UND Taster2 gedrückt → LED aus

### 3. Arduino IDE Integration
- Generierte .ino Dateien in `output/` speichern
- Arduino IDE direkt starten mit generiertem Code
- Pfad: `arduino-ide/ArduinoPortable.exe`

## Ordnerstruktur

```
Arduino Wiki/
├── CLAUDE.md                    ← Diese Datei
├── README.md                    ← Benutzer-Dokumentation
├── logo.svg                     ← Zeasy Logo (Icon)
├── logo_text_horizontal.svg     ← Zeasy Logo mit Text
├── logo_text_vertical.svg       ← Zeasy Logo vertikal
│
├── data/
│   └── projects.json            ← 40 Projekt-Definitionen
│
├── solutions/                   ← 40 fertige .ino Dateien
│   ├── led_blinken.ino
│   ├── led_abwechselnd.ino
│   └── ... (38 weitere)
│
├── output/                      ← Generierte Dateien (zur Laufzeit)
│
├── arduino-ide/                 ← Portable Arduino IDE
│   └── ArduinoPortable.exe
│
├── src-tauri/                   ← Tauri Backend (Rust) [NOCH ERSTELLEN]
│
└── src/                         ← Frontend [NOCH ERSTELLEN]
    ├── index.html
    ├── main.js
    ├── generator.js
    ├── components.json
    └── style.css
```

## Nächste Schritte

1. Tauri-Projekt initialisieren: `npm create tauri-app@latest`
2. Frontend mit Vite aufsetzen
3. Wiki-UI implementieren
4. Code-Generator implementieren
5. Tauri-Commands für Dateisystem + IDE-Start
6. Build & Test

## Befehle

```bash
# Entwicklung starten
npm run tauri dev

# App builden
npm run tauri build

# Nur Frontend (ohne Tauri)
npm run dev
```
