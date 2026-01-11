/*
 * Projekt 35: Helligkeitsgesteuertes Lauflicht
 * Geschwindigkeit des Lauflichts hängt von Umgebungshelligkeit ab.
 *
 * Schaltung:
 * - LEDs an Pins 8-12
 * - LDR + 10kΩ an A0
 */

const int LED_PINS[] = {8, 9, 10, 11, 12};
const int ANZAHL_LEDS = 5;
const int LDR_PIN = A0;

void setup() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  int helligkeit = analogRead(LDR_PIN);
  int geschwindigkeit = map(helligkeit, 0, 1023, 500, 50);

  Serial.print("Helligkeit: ");
  Serial.print(helligkeit);
  Serial.print(" -> Geschwindigkeit: ");
  Serial.print(geschwindigkeit);
  Serial.println(" ms");

  // Vorwärts
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(geschwindigkeit);
    digitalWrite(LED_PINS[i], LOW);
  }

  // Rückwärts
  for (int i = ANZAHL_LEDS - 2; i > 0; i--) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(geschwindigkeit);
    digitalWrite(LED_PINS[i], LOW);
  }
}
