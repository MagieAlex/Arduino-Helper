/*
 * Projekt 38: Countdown mit LEDs
 * 5 LEDs zählen von 5 nach 0 runter, dann blinken alle.
 *
 * Schaltung:
 * - LEDs an Pins 8-12 (jeweils mit 220Ω)
 */

const int LED_PINS[] = {8, 9, 10, 11, 12};
const int ANZAHL_LEDS = 5;

void setup() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  // Alle LEDs einschalten
  alleAn();
  Serial.println("START - 5");
  delay(1000);

  // Countdown
  for (int i = ANZAHL_LEDS - 1; i >= 0; i--) {
    digitalWrite(LED_PINS[i], LOW);
    Serial.println(i);
    delay(1000);
  }

  // Blinken am Ende
  Serial.println("FERTIG!");
  for (int i = 0; i < 10; i++) {
    alleAn();
    delay(100);
    alleAus();
    delay(100);
  }

  delay(2000);  // Pause vor Neustart
}

void alleAn() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], HIGH);
  }
}

void alleAus() {
  for (int i = 0; i < ANZAHL_LEDS; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
}
