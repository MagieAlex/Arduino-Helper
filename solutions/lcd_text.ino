/*
 * Projekt 15: Fester Text auf LCD
 * Ein 16x2 LCD Display zeigt einen festen Text an.
 *
 * Schaltung (4-Bit-Modus):
 * - RS an Pin 8, E an Pin 9
 * - D4-D7 an Pins 4-7
 * - Potentiometer für Kontrast
 */

#include <LiquidCrystal.h>

// RS, E, D4, D5, D6, D7
LiquidCrystal lcd(8, 9, 4, 5, 6, 7);

void setup() {
  lcd.begin(16, 2);  // 16 Spalten, 2 Zeilen

  lcd.setCursor(0, 0);
  lcd.print("Arduino Wiki");

  lcd.setCursor(0, 1);
  lcd.print("Projekt 15");
}

void loop() {
  // Text ist statisch, nichts zu tun
}
