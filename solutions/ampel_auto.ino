/*
 * Projekt 3: Ampelsteuerung (Auto)
 * Simulation einer Verkehrsampel mit korrekten Phasen.
 *
 * Schaltung:
 * - Rote LED an Pin 10
 * - Gelbe LED an Pin 11
 * - Grüne LED an Pin 12
 * - Alle mit 220Ω Vorwiderstand, Kathoden an GND
 */

const int ROT_PIN = 10;
const int GELB_PIN = 11;
const int GRUEN_PIN = 12;

void setup() {
  pinMode(ROT_PIN, OUTPUT);
  pinMode(GELB_PIN, OUTPUT);
  pinMode(GRUEN_PIN, OUTPUT);
}

void loop() {
  // Rot
  digitalWrite(ROT_PIN, HIGH);
  digitalWrite(GELB_PIN, LOW);
  digitalWrite(GRUEN_PIN, LOW);
  delay(3000);

  // Rot-Gelb
  digitalWrite(GELB_PIN, HIGH);
  delay(1000);

  // Grün
  digitalWrite(ROT_PIN, LOW);
  digitalWrite(GELB_PIN, LOW);
  digitalWrite(GRUEN_PIN, HIGH);
  delay(3000);

  // Gelb
  digitalWrite(GRUEN_PIN, LOW);
  digitalWrite(GELB_PIN, HIGH);
  delay(1000);
}
