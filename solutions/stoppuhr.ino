/*
 * Projekt 40: Stoppuhr mit Taster
 * Taster startet/stoppt Zeitmessung, Ergebnis im Serial Monitor.
 *
 * Schaltung:
 * - Taster an Pin 2 (mit 10kΩ Pull-Down)
 */

const int TASTER_PIN = 2;

bool laeuft = false;
unsigned long startZeit = 0;
bool letzterZustand = LOW;

void setup() {
  pinMode(TASTER_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("=== STOPPUHR ===");
  Serial.println("Taster druecken zum Starten/Stoppen");
  Serial.println();
}

void loop() {
  bool aktuellerZustand = digitalRead(TASTER_PIN);

  // Flanke erkennen
  if (aktuellerZustand == HIGH && letzterZustand == LOW) {
    if (!laeuft) {
      // Starten
      startZeit = millis();
      laeuft = true;
      Serial.println("GESTARTET...");
    } else {
      // Stoppen
      unsigned long endZeit = millis();
      unsigned long dauer = endZeit - startZeit;
      laeuft = false;

      // Zeit formatieren
      unsigned long sekunden = dauer / 1000;
      unsigned long millisek = dauer % 1000;
      unsigned long minuten = sekunden / 60;
      sekunden = sekunden % 60;

      Serial.print("GESTOPPT: ");
      if (minuten > 0) {
        Serial.print(minuten);
        Serial.print(" min ");
      }
      Serial.print(sekunden);
      Serial.print(",");
      Serial.print(millisek);
      Serial.println(" sek");
      Serial.println();
    }

    delay(200);  // Entprellung
  }

  // Laufende Zeit anzeigen
  if (laeuft) {
    unsigned long aktuelleZeit = millis() - startZeit;
    Serial.print("Zeit: ");
    Serial.print(aktuelleZeit / 1000.0, 1);
    Serial.println(" s");
    delay(100);
  }

  letzterZustand = aktuellerZustand;
}
