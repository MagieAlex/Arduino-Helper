/*
 * Projekt 2: Zwei LED abwechselnd blinken
 * Zwei LEDs blinken abwechselnd - wenn eine an ist, ist die andere aus.
 *
 * Schaltung:
 * - LED 1 an Pin 12 (mit 220Ω Vorwiderstand)
 * - LED 2 an Pin 13 (mit 220Ω Vorwiderstand)
 * - Kathoden an GND
 */

const int LED1_PIN = 12;
const int LED2_PIN = 13;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED1_PIN, HIGH);
  digitalWrite(LED2_PIN, LOW);
  delay(500);

  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, HIGH);
  delay(500);
}
