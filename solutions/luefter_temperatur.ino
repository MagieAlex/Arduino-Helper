/*
 * Projekt 13: Lüftersteuerung mit Temperaturfühler
 * Relais schaltet bei Überschreiten einer Temperaturgrenze ein.
 *
 * Schaltung:
 * - TMP36 an A0 (VCC-Signal-GND)
 * - Relais-Modul an Pin 7
 */

const int RELAIS_PIN = 7;
const int TEMP_PIN = A0;
const float SCHWELLE_EIN = 25.0;   // Grad Celsius
const float SCHWELLE_AUS = 23.0;   // Hysterese

void setup() {
  pinMode(RELAIS_PIN, OUTPUT);
  digitalWrite(RELAIS_PIN, LOW);
  Serial.begin(9600);
}

void loop() {
  float temperatur = leseTemperatur();

  Serial.print("Temperatur: ");
  Serial.print(temperatur);
  Serial.println(" C");

  if (temperatur >= SCHWELLE_EIN) {
    digitalWrite(RELAIS_PIN, HIGH);  // Lüfter an
    Serial.println("Luefter: AN");
  } else if (temperatur <= SCHWELLE_AUS) {
    digitalWrite(RELAIS_PIN, LOW);   // Lüfter aus
    Serial.println("Luefter: AUS");
  }

  delay(1000);
}

float leseTemperatur() {
  int sensorWert = analogRead(TEMP_PIN);
  float spannung = sensorWert * (5.0 / 1023.0);
  float temperatur = (spannung - 0.5) * 100.0;  // TMP36 Formel
  return temperatur;
}
