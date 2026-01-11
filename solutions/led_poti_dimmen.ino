/*
 * Projekt 10: LED dimmen mit Potentiometer
 * LED-Helligkeit wird stufenlos über Potentiometer per PWM gesteuert.
 *
 * Schaltung:
 * - LED an Pin 9 (PWM-fähig, mit 220Ω Vorwiderstand)
 * - Potentiometer: Außen 5V/GND, Mitte an A0
 */

const int LED_PIN = 9;  // PWM-Pin!
const int POTI_PIN = A0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int potiWert = analogRead(POTI_PIN);
  int helligkeit = map(potiWert, 0, 1023, 0, 255);

  analogWrite(LED_PIN, helligkeit);
  delay(10);
}
