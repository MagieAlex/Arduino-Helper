/*
 * Projekt 19: Stepper-Motor mit Tastern steuern
 * Zwei Taster drehen Schrittmotor links oder rechts.
 *
 * Schaltung:
 * - Stepper an Pins 8-11 (über Treiber wie ULN2003)
 * - Taster Links an Pin 2, Rechts an Pin 3
 */

#include <Stepper.h>

const int SCHRITTE_PRO_UMDREHUNG = 2048;
Stepper meinStepper(SCHRITTE_PRO_UMDREHUNG, 8, 10, 9, 11);

const int TASTER_LINKS = 2;
const int TASTER_RECHTS = 3;
const int SCHRITTWEITE = 100;

void setup() {
  meinStepper.setSpeed(10);  // U/min
  pinMode(TASTER_LINKS, INPUT);
  pinMode(TASTER_RECHTS, INPUT);
}

void loop() {
  if (digitalRead(TASTER_LINKS) == HIGH) {
    meinStepper.step(-SCHRITTWEITE);
  }

  if (digitalRead(TASTER_RECHTS) == HIGH) {
    meinStepper.step(SCHRITTWEITE);
  }
}
