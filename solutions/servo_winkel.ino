/*
 * Projekt 29: Servo auf bestimmte Winkel
 * Servo fährt nacheinander verschiedene vorprogrammierte Winkel an.
 *
 * Schaltung:
 * - Servo Signal an Pin 9
 * - VCC an 5V, GND an GND
 */

#include <Servo.h>

Servo meinServo;
const int SERVO_PIN = 9;

int winkel[] = {0, 45, 90, 135, 180, 90};
int anzahlWinkel = 6;

void setup() {
  meinServo.attach(SERVO_PIN);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < anzahlWinkel; i++) {
    Serial.print("Fahre zu: ");
    Serial.print(winkel[i]);
    Serial.println(" Grad");

    meinServo.write(winkel[i]);
    delay(1000);
  }
}
