/*
 * Projekt 9: LED Blinkfrequenz mit Potentiometer
 * Die Blinkgeschwindigkeit wird über ein Potentiometer gesteuert.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Potentiometer: Außen 5V/GND, Mitte an A0
 */

const int LED_PIN = 13;
const int POTI_PIN = A0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int potiWert = analogRead(POTI_PIN);
  int verzoegerung = map(potiWert, 0, 1023, 50, 1000);

  digitalWrite(LED_PIN, HIGH);
  delay(verzoegerung);
  digitalWrite(LED_PIN, LOW);
  delay(verzoegerung);
}
