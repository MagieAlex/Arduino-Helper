/*
 * Projekt 11: LED mit Dämmerungsschalter
 * LED schaltet automatisch ein wenn es dunkel wird.
 *
 * Schaltung:
 * - LED an Pin 13 (mit 220Ω Vorwiderstand)
 * - LDR + 10kΩ als Spannungsteiler an A0
 */

const int LED_PIN = 13;
const int LDR_PIN = A0;
const int SCHWELLWERT = 300;  // Anpassen je nach LDR

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int helligkeit = analogRead(LDR_PIN);

  Serial.print("Helligkeit: ");
  Serial.println(helligkeit);

  if (helligkeit < SCHWELLWERT) {
    digitalWrite(LED_PIN, HIGH);  // Dunkel -> LED an
  } else {
    digitalWrite(LED_PIN, LOW);   // Hell -> LED aus
  }

  delay(100);
}
