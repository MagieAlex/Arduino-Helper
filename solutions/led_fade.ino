/*
 * Projekt 39: Fade-Effekt mit einer LED
 * LED wird langsam heller und dann wieder dunkler (PWM).
 *
 * Schaltung:
 * - LED an Pin 9 (PWM-fähig, mit 220Ω)
 */

const int LED_PIN = 9;  // PWM-Pin!
const int GESCHWINDIGKEIT = 10;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Aufblenden
  for (int helligkeit = 0; helligkeit <= 255; helligkeit++) {
    analogWrite(LED_PIN, helligkeit);
    delay(GESCHWINDIGKEIT);
  }

  // Abblenden
  for (int helligkeit = 255; helligkeit >= 0; helligkeit--) {
    analogWrite(LED_PIN, helligkeit);
    delay(GESCHWINDIGKEIT);
  }
}
