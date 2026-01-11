# Installation - Arduino Helper

Diese Anleitung erklärt Schritt für Schritt, wie du Arduino Helper auf deinem USB-Stick installierst.

**Gute Nachricht:** Die Arduino IDE ist bereits im Download enthalten! Du musst nichts extra installieren.

---

## Download & Installation

### Schritt 1: Repository herunterladen

1. Öffne [https://github.com/MagieAlex/Arduino-Helper](https://github.com/MagieAlex/Arduino-Helper)
2. Klicke auf den grünen **"Code"** Button
3. Wähle **"Download ZIP"**
4. Warte bis der Download abgeschlossen ist (~550 MB)

### Schritt 2: Entpacken

1. Stecke deinen USB-Stick ein
2. Öffne den Downloads-Ordner
3. Rechtsklick auf `Arduino-Helper-main.zip`
4. Wähle **"Alle extrahieren..."**
5. Als Ziel wählst du deinen USB-Stick (z.B. `E:\`)
6. Klicke auf **"Extrahieren"**

### Schritt 3: Ordner umbenennen (optional)

Der entpackte Ordner heißt `Arduino-Helper-main`. Du kannst ihn umbenennen zu `Arduino Helper`.

### Schritt 4: Starten

1. Öffne den Ordner auf deinem USB-Stick
2. Doppelklicke auf **`Arduino Helper.exe`**
3. Fertig!

---

## Ordnerstruktur

So sieht der Ordner aus:

```
USB-Stick (E:\)
└── Arduino Helper\
    ├── Arduino Helper.exe    ← Hier starten!
    ├── arduino-ide\          ← Arduino IDE (bereits dabei!)
    │   └── arduino.exe
    ├── data\
    │   └── projects.json
    ├── solutions\            ← 40 Projektdateien
    └── output\               ← Generierte Dateien
```

**Wichtig:** Der komplette Ordner muss zusammen bleiben!

---

## Fehlerbehebung

### "Windows Defender blockiert die App"

**Problem:** Windows zeigt eine Warnung beim Starten.

**Lösung:**
1. Klicke auf **"Weitere Informationen"**
2. Klicke auf **"Trotzdem ausführen"**

Dies passiert, weil die App nicht signiert ist. Sie ist aber sicher!

### "App startet nicht"

**Problem:** Beim Doppelklick passiert nichts.

**Lösung:**
1. Prüfe ob alle Dateien entpackt wurden
2. Versuche Rechtsklick → **"Als Administrator ausführen"**
3. Stelle sicher, dass der USB-Stick nicht schreibgeschützt ist

### "Projekte werden nicht angezeigt"

**Problem:** Die Projektliste ist leer.

**Lösung:**
1. Prüfe ob `data/projects.json` existiert
2. Prüfe ob der Ordner `solutions/` die `.ino` Dateien enthält

### "Arduino IDE öffnet sich nicht"

**Problem:** Beim Klick auf "In Arduino IDE öffnen" passiert nichts.

**Lösung:**
1. Prüfe ob der Ordner `arduino-ide/` existiert
2. Prüfe ob `arduino-ide/arduino.exe` vorhanden ist

---

## Für Entwickler: Selbst bauen

Falls du die App selbst bauen möchtest, brauchst du:

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/)
- [Git](https://git-scm.com/)

```bash
git clone https://github.com/MagieAlex/Arduino-Helper.git
cd Arduino-Helper
npm install
npm run tauri build
```

Die fertige `.exe` findest du in `src-tauri/target/release/`.

---

## Fragen?

Bei Problemen erstelle ein Issue auf GitHub:
[https://github.com/MagieAlex/Arduino-Helper/issues](https://github.com/MagieAlex/Arduino-Helper/issues)

---

**Viel Spaß mit Arduino Helper!**
