/*
 * Projekt 7: LED permanent an/aus mit zwei Tastern
 * Ein Taster schaltet LED ein, der andere schaltet sie aus.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Taster EIN an Pin 2 (mit 10kΩ Pull-Down)
 * - Taster AUS an Pin 3 (mit 10kΩ Pull-Down)
 */

const int LED_PIN = 13;
const int TASTER_EIN_PIN = 2;
const int TASTER_AUS_PIN = 3;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(TASTER_EIN_PIN, INPUT);
  pinMode(TASTER_AUS_PIN, INPUT);
}

void loop() {
  if (digitalRead(TASTER_EIN_PIN) == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  }

  if (digitalRead(TASTER_AUS_PIN) == HIGH) {
    digitalWrite(LED_PIN, LOW);
  }
}
