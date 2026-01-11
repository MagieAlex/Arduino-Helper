/*
 * Projekt 22: RGB-LED mit 3 Tastern
 * Jeder Taster schaltet eine Farbe der RGB-LED ein/aus.
 *
 * Schaltung:
 * - RGB-LED: R Pin 9, G Pin 10, B Pin 11
 * - Taster Rot Pin 2, Grün Pin 3, Blau Pin 4
 */

const int ROT_PIN = 9;
const int GRUEN_PIN = 10;
const int BLAU_PIN = 11;
const int TASTER_R = 2;
const int TASTER_G = 3;
const int TASTER_B = 4;

bool rotAn = false;
bool gruenAn = false;
bool blauAn = false;
bool letzterR = LOW, letzterG = LOW, letzterB = LOW;

void setup() {
  pinMode(ROT_PIN, OUTPUT);
  pinMode(GRUEN_PIN, OUTPUT);
  pinMode(BLAU_PIN, OUTPUT);
  pinMode(TASTER_R, INPUT);
  pinMode(TASTER_G, INPUT);
  pinMode(TASTER_B, INPUT);
}

void loop() {
  // Rot Toggle
  if (digitalRead(TASTER_R) == HIGH && letzterR == LOW) {
    rotAn = !rotAn;
    delay(50);
  }
  letzterR = digitalRead(TASTER_R);

  // Grün Toggle
  if (digitalRead(TASTER_G) == HIGH && letzterG == LOW) {
    gruenAn = !gruenAn;
    delay(50);
  }
  letzterG = digitalRead(TASTER_G);

  // Blau Toggle
  if (digitalRead(TASTER_B) == HIGH && letzterB == LOW) {
    blauAn = !blauAn;
    delay(50);
  }
  letzterB = digitalRead(TASTER_B);

  // LEDs setzen
  digitalWrite(ROT_PIN, rotAn);
  digitalWrite(GRUEN_PIN, gruenAn);
  digitalWrite(BLAU_PIN, blauAn);
}
