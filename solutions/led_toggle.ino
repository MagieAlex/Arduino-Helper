/*
 * Projekt 6: LED permanent an/aus mit einem Taster
 * Toggle-Funktion: Ein Tasterdruck schaltet LED ein, nächster Druck aus.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Taster an Pin 2 (mit 10kΩ Pull-Down-Widerstand)
 */

const int LED_PIN = 13;
const int TASTER_PIN = 2;

bool ledZustand = false;
bool letzterTasterZustand = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(TASTER_PIN, INPUT);
}

void loop() {
  bool aktuellerTasterZustand = digitalRead(TASTER_PIN);

  // Flanke erkennen (Taster wurde gerade gedrückt)
  if (aktuellerTasterZustand == HIGH && letzterTasterZustand == LOW) {
    ledZustand = !ledZustand;  // Zustand umschalten
    digitalWrite(LED_PIN, ledZustand);
    delay(50);  // Entprellung
  }

  letzterTasterZustand = aktuellerTasterZustand;
}
