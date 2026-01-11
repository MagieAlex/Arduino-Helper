/*
 * Projekt 5: LED mit Taster steuern (Morsen)
 * LED leuchtet nur solange der Taster gedrückt wird.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Taster an Pin 2 (mit 10kΩ Pull-Down-Widerstand)
 */

const int LED_PIN = 13;
const int TASTER_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(TASTER_PIN, INPUT);
}

void loop() {
  int tasterZustand = digitalRead(TASTER_PIN);

  if (tasterZustand == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
