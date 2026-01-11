/*
 * Projekt 8: Ampelsteuerung mit Fußgängeranforderung
 * Autoampel + Fußgängerampel mit Anforderungstaster.
 *
 * Schaltung:
 * - Auto: Rot Pin 10, Gelb Pin 11, Grün Pin 12
 * - Fußgänger: Rot Pin 8, Grün Pin 9
 * - Anforderungstaster an Pin 2
 */

const int AUTO_ROT = 10;
const int AUTO_GELB = 11;
const int AUTO_GRUEN = 12;
const int FUSS_ROT = 8;
const int FUSS_GRUEN = 9;
const int TASTER = 2;

bool anforderung = false;

void setup() {
  pinMode(AUTO_ROT, OUTPUT);
  pinMode(AUTO_GELB, OUTPUT);
  pinMode(AUTO_GRUEN, OUTPUT);
  pinMode(FUSS_ROT, OUTPUT);
  pinMode(FUSS_GRUEN, OUTPUT);
  pinMode(TASTER, INPUT);

  // Startzustand: Auto grün, Fußgänger rot
  digitalWrite(AUTO_GRUEN, HIGH);
  digitalWrite(FUSS_ROT, HIGH);
}

void loop() {
  if (digitalRead(TASTER) == HIGH) {
    anforderung = true;
  }

  if (anforderung) {
    delay(1000);  // Kurz warten

    // Auto auf Gelb
    digitalWrite(AUTO_GRUEN, LOW);
    digitalWrite(AUTO_GELB, HIGH);
    delay(2000);

    // Auto auf Rot
    digitalWrite(AUTO_GELB, LOW);
    digitalWrite(AUTO_ROT, HIGH);
    delay(1000);

    // Fußgänger auf Grün
    digitalWrite(FUSS_ROT, LOW);
    digitalWrite(FUSS_GRUEN, HIGH);
    delay(5000);

    // Fußgänger auf Rot
    digitalWrite(FUSS_GRUEN, LOW);
    digitalWrite(FUSS_ROT, HIGH);
    delay(1000);

    // Auto auf Rot-Gelb
    digitalWrite(AUTO_GELB, HIGH);
    delay(1000);

    // Auto auf Grün
    digitalWrite(AUTO_ROT, LOW);
    digitalWrite(AUTO_GELB, LOW);
    digitalWrite(AUTO_GRUEN, HIGH);

    anforderung = false;
  }
}
