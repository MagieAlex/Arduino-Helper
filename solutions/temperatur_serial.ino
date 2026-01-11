/*
 * Projekt 24: Temperaturanzeige Serial Monitor
 * Temperatur wird mit TMP36 gemessen und in Celsius ausgegeben.
 *
 * Schaltung:
 * - TMP36: Links +5V, Mitte A0, Rechts GND
 */

const int TEMP_PIN = A0;

void setup() {
  Serial.begin(9600);
  Serial.println("Temperaturmessung mit TMP36");
  Serial.println("---------------------------");
}

void loop() {
  int sensorWert = analogRead(TEMP_PIN);
  float spannung = sensorWert * (5.0 / 1023.0);
  float temperatur = (spannung - 0.5) * 100.0;

  Serial.print("Rohwert: ");
  Serial.print(sensorWert);
  Serial.print(" | Spannung: ");
  Serial.print(spannung, 2);
  Serial.print("V | Temperatur: ");
  Serial.print(temperatur, 1);
  Serial.println(" C");

  delay(1000);
}
