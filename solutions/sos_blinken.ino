/*
 * Projekt 14: SOS Blinken mit FOR-Schleife
 * LED blinkt das Morse-Signal SOS (... --- ...).
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 */

const int LED_PIN = 13;
const int PUNKT = 200;      // Kurz
const int STRICH = 600;     // Lang
const int PAUSE = 200;      // Zwischen Zeichen
const int WORT_PAUSE = 1400; // Zwischen Wörtern

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // S (...)
  for (int i = 0; i < 3; i++) {
    blink(PUNKT);
  }
  delay(PAUSE * 2);

  // O (---)
  for (int i = 0; i < 3; i++) {
    blink(STRICH);
  }
  delay(PAUSE * 2);

  // S (...)
  for (int i = 0; i < 3; i++) {
    blink(PUNKT);
  }

  delay(WORT_PAUSE);
}

void blink(int dauer) {
  digitalWrite(LED_PIN, HIGH);
  delay(dauer);
  digitalWrite(LED_PIN, LOW);
  delay(PAUSE);
}
