/*
 * Projekt 28: Einparkhilfe mit LEDs
 * Je näher ein Objekt, desto mehr LEDs leuchten.
 *
 * Schaltung:
 * - HC-SR04: Trig Pin 9, Echo Pin 10
 * - 5 LEDs an Pins 4-8
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LED_PINS[] = {4, 5, 6, 7, 8};
const int ANZAHL_LEDS = 5;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }

  Serial.begin(9600);
}

void loop() {
  float entfernung = messeEntfernung();

  Serial.print("Entfernung: ");
  Serial.print(entfernung);
  Serial.println(" cm");

  // LEDs basierend auf Entfernung einschalten
  int anzahlAn = 0;

  if (entfernung < 100) anzahlAn = 1;
  if (entfernung < 80) anzahlAn = 2;
  if (entfernung < 60) anzahlAn = 3;
  if (entfernung < 40) anzahlAn = 4;
  if (entfernung < 20) anzahlAn = 5;

  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], i < anzahlAn ? HIGH : LOW);
  }

  delay(100);
}

float messeEntfernung() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long dauer = pulseIn(ECHO_PIN, HIGH);
  return dauer * 0.034 / 2;
}
