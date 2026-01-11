/*
 * Projekt 25: Piezo-Summer Melodie
 * Ein Piezo-Summer spielt eine einfache Melodie ab.
 *
 * Schaltung:
 * - Piezo-Summer an Pin 8 und GND
 */

const int PIEZO_PIN = 8;

// Noten-Frequenzen
#define NOTE_C4  262
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440
#define NOTE_B4  494
#define NOTE_C5  523

// Melodie (Alle meine Entchen)
int melodie[] = {
  NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_G4,
  NOTE_A4, NOTE_A4, NOTE_A4, NOTE_A4, NOTE_G4,
  NOTE_A4, NOTE_A4, NOTE_A4, NOTE_A4, NOTE_G4,
  NOTE_F4, NOTE_F4, NOTE_F4, NOTE_F4, NOTE_E4, NOTE_E4,
  NOTE_D4, NOTE_D4, NOTE_D4, NOTE_D4, NOTE_C4
};

int dauer[] = {
  4, 4, 4, 4, 2, 2,
  4, 4, 4, 4, 1,
  4, 4, 4, 4, 1,
  4, 4, 4, 4, 2, 2,
  4, 4, 4, 4, 1
};

void setup() {
  // Nichts zu initialisieren
}

void loop() {
  for (int i = 0; i < 27; i++) {
    int noteDauer = 1000 / dauer[i];
    tone(PIEZO_PIN, melodie[i], noteDauer);
    delay(noteDauer * 1.3);
    noTone(PIEZO_PIN);
  }

  delay(2000);  // Pause vor Wiederholung
}
