/*
 * Projekt 30: Servo mit Potentiometer
 * Potentiometer-Position wird direkt auf Servo-Winkel abgebildet.
 *
 * Schaltung:
 * - Servo Signal an Pin 9
 * - Potentiometer Mitte an A0
 */

#include <Servo.h>

Servo meinServo;
const int SERVO_PIN = 9;
const int POTI_PIN = A0;

void setup() {
  meinServo.attach(SERVO_PIN);
  Serial.begin(9600);
}

void loop() {
  int potiWert = analogRead(POTI_PIN);
  int winkel = map(potiWert, 0, 1023, 0, 180);

  Serial.print("Poti: ");
  Serial.print(potiWert);
  Serial.print(" -> Winkel: ");
  Serial.println(winkel);

  meinServo.write(winkel);
  delay(15);
}
