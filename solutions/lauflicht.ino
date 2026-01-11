/*
 * Projekt 4: Lauflicht (5 LED nacheinander)
 * Knight-Rider-Effekt: 5 LEDs leuchten nacheinander auf.
 *
 * Schaltung:
 * - LEDs an Pins 8-12 (jeweils mit 220Ω Vorwiderstand)
 * - Kathoden an GND
 */

const int LED_PINS[] = {8, 9, 10, 11, 12};
const int ANZAHL_LEDS = 5;
const int GESCHWINDIGKEIT = 100;

void setup() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
}

void loop() {
  // Vorwärts
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(GESCHWINDIGKEIT);
    digitalWrite(LED_PINS[i], LOW);
  }

  // Rückwärts
  for (int i = ANZAHL_LEDS - 2; i > 0; i--) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(GESCHWINDIGKEIT);
    digitalWrite(LED_PINS[i], LOW);
  }
}
