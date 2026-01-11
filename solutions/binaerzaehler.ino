/*
 * Projekt 33: Binärzähler mit 4 LEDs
 * 4 LEDs zählen binär von 0 bis 15 hoch.
 *
 * Schaltung:
 * - LED 0 (LSB) an Pin 10
 * - LED 1 an Pin 11
 * - LED 2 an Pin 12
 * - LED 3 (MSB) an Pin 13
 */

const int LED_PINS[] = {10, 11, 12, 13};
const int ANZAHL_LEDS = 4;

void setup() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  for (int zahl = 0; zahl < 16; zahl++) {
    zeigeZahl(zahl);

    Serial.print("Dezimal: ");
    Serial.print(zahl);
    Serial.print(" | Binaer: ");
    for (int i = 3; i >= 0; i--) {
      Serial.print((zahl >> i) & 1);
    }
    Serial.println();

    delay(1000);
  }
}

void zeigeZahl(int zahl) {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], (zahl >> i) & 1);
  }
}
