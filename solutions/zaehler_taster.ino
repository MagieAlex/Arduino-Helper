/*
 * Projekt 34: Zähler mit Taster und LEDs
 * Jeder Tasterdruck erhöht den Zähler, LEDs zeigen binär den Wert.
 *
 * Schaltung:
 * - Taster an Pin 2
 * - LEDs an Pins 10-13
 */

const int TASTER_PIN = 2;
const int LED_PINS[] = {10, 11, 12, 13};
const int ANZAHL_LEDS = 4;

int zaehler = 0;
bool letzterZustand = LOW;

void setup() {
  pinMode(TASTER_PIN, INPUT);
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  Serial.begin(9600);
  zeigeZahl(zaehler);
}

void loop() {
  bool aktuellerZustand = digitalRead(TASTER_PIN);

  // Steigende Flanke erkennen
  if (aktuellerZustand == HIGH && letzterZustand == LOW) {
    zaehler++;
    if (zaehler > 15) zaehler = 0;  // Überlauf

    zeigeZahl(zaehler);

    Serial.print("Zaehler: ");
    Serial.println(zaehler);

    delay(50);  // Entprellung
  }

  letzterZustand = aktuellerZustand;
}

void zeigeZahl(int zahl) {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], (zahl >> i) & 1);
  }
}
