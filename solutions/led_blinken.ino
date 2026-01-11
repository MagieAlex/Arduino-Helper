/*
 * Projekt 1: LED zum Blinken bringen
 * Eine LED blinkt im Sekundentakt an und aus.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - Kathode an GND
 */

const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // LED einschalten
  delay(1000);                   // 1 Sekunde warten
  digitalWrite(LED_PIN, LOW);   // LED ausschalten
  delay(1000);                   // 1 Sekunde warten
}
