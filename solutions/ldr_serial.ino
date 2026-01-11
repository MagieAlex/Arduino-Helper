/*
 * Projekt 23: Helligkeitssensor auf Serial Monitor
 * LDR-Werte werden kontinuierlich ausgegeben.
 *
 * Schaltung:
 * - LDR + 10kΩ als Spannungsteiler an A0
 */

const int LDR_PIN = A0;

void setup() {
  Serial.begin(9600);
  Serial.println("Helligkeitsmessung gestartet");
  Serial.println("----------------------------");
}

void loop() {
  int wert = analogRead(LDR_PIN);
  int prozent = map(wert, 0, 1023, 0, 100);

  Serial.print("Rohwert: ");
  Serial.print(wert);
  Serial.print(" | Helligkeit: ");
  Serial.print(prozent);
  Serial.println("%");

  delay(500);
}
