/*
 * Projekt 16: Messwert auf LCD anzeigen
 * Analoger Sensorwert wird live auf LCD angezeigt.
 *
 * Schaltung:
 * - LCD wie Projekt 15
 * - Analoger Sensor (z.B. Poti) an A0
 */

#include <LiquidCrystal.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
const int SENSOR_PIN = A0;

void setup() {
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("Messwert:");
}

void loop() {
  int wert = analogRead(SENSOR_PIN);

  lcd.setCursor(0, 1);
  lcd.print("                ");  // Zeile löschen
  lcd.setCursor(0, 1);
  lcd.print(wert);
  lcd.print(" (");
  lcd.print(map(wert, 0, 1023, 0, 100));
  lcd.print("%)");

  delay(200);
}
