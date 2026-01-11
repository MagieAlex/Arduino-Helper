/*
 * Projekt 20: LED-Zustandssteuerung mit 2 Tastern
 * Kein Taster = LED an, 1 Taster = LED blinkt, 2 Taster = LED aus.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Taster 1 an Pin 2, Taster 2 an Pin 3 (mit 10kΩ Pull-Down)
 */

const int LED_PIN = 13;
const int TASTER1_PIN = 2;
const int TASTER2_PIN = 3;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(TASTER1_PIN, INPUT);
  pinMode(TASTER2_PIN, INPUT);
}

void loop() {
  bool taster1 = digitalRead(TASTER1_PIN);
  bool taster2 = digitalRead(TASTER2_PIN);

  if (taster1 && taster2) {
    // Beide gedrückt: LED aus
    digitalWrite(LED_PIN, LOW);
  } else if (taster1 || taster2) {
    // Einer gedrückt: LED blinkt
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  } else {
    // Keiner gedrückt: LED an
    digitalWrite(LED_PIN, HIGH);
  }
}
