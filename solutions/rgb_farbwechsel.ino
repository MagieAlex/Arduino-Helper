/*
 * Projekt 21: RGB-LED Farbwechsel
 * RGB-LED wechselt automatisch durch alle Farben.
 *
 * Schaltung:
 * - Rot an Pin 9, Grün an Pin 10, Blau an Pin 11 (PWM)
 * - Gemeinsame Kathode an GND
 * - Jeweils 220Ω Vorwiderstand
 */

const int ROT_PIN = 9;
const int GRUEN_PIN = 10;
const int BLAU_PIN = 11;

void setup() {
  pinMode(ROT_PIN, OUTPUT);
  pinMode(GRUEN_PIN, OUTPUT);
  pinMode(BLAU_PIN, OUTPUT);
}

void loop() {
  // Rot -> Gelb
  for (int i = 0; i <= 255; i++) {
    analogWrite(ROT_PIN, 255);
    analogWrite(GRUEN_PIN, i);
    analogWrite(BLAU_PIN, 0);
    delay(10);
  }

  // Gelb -> Grün
  for (int i = 255; i >= 0; i--) {
    analogWrite(ROT_PIN, i);
    analogWrite(GRUEN_PIN, 255);
    analogWrite(BLAU_PIN, 0);
    delay(10);
  }

  // Grün -> Cyan
  for (int i = 0; i <= 255; i++) {
    analogWrite(ROT_PIN, 0);
    analogWrite(GRUEN_PIN, 255);
    analogWrite(BLAU_PIN, i);
    delay(10);
  }

  // Cyan -> Blau
  for (int i = 255; i >= 0; i--) {
    analogWrite(ROT_PIN, 0);
    analogWrite(GRUEN_PIN, i);
    analogWrite(BLAU_PIN, 255);
    delay(10);
  }

  // Blau -> Magenta
  for (int i = 0; i <= 255; i++) {
    analogWrite(ROT_PIN, i);
    analogWrite(GRUEN_PIN, 0);
    analogWrite(BLAU_PIN, 255);
    delay(10);
  }

  // Magenta -> Rot
  for (int i = 255; i >= 0; i--) {
    analogWrite(ROT_PIN, 255);
    analogWrite(GRUEN_PIN, 0);
    analogWrite(BLAU_PIN, i);
    delay(10);
  }
}
