/*
 * Projekt 18: Servomotor mit Joystick steuern
 * Joystick-Position steuert Winkel eines Servomotors.
 *
 * Schaltung:
 * - Servo Signal an Pin 9
 * - Joystick VRx an A0
 */

#include <Servo.h>

Servo meinServo;
const int SERVO_PIN = 9;
const int JOYSTICK_PIN = A0;

void setup() {
  meinServo.attach(SERVO_PIN);
}

void loop() {
  int joystickWert = analogRead(JOYSTICK_PIN);
  int winkel = map(joystickWert, 0, 1023, 0, 180);

  meinServo.write(winkel);
  delay(15);
}
