/*
 * Projekt 32: Würfelsimulation mit 7 LEDs
 * Taster drücken würfelt eine Zahl, 7 LEDs zeigen das Würfelbild.
 *
 * LED-Anordnung (wie echter Würfel):
 *   [0]   [1]      Pins: 3, 4
 *   [2][3][4]      Pins: 5, 6, 7
 *   [5]   [6]      Pins: 8, 9
 *
 * Taster an Pin 2
 */

const int TASTER_PIN = 2;
const int LED_PINS[] = {3, 4, 5, 6, 7, 8, 9};

// Welche LEDs für welche Zahl leuchten
const bool WUERFEL[6][7] = {
  {0, 0, 0, 1, 0, 0, 0},  // 1: Mitte
  {1, 0, 0, 0, 0, 0, 1},  // 2: Diagonal
  {1, 0, 0, 1, 0, 0, 1},  // 3: Diagonal + Mitte
  {1, 1, 0, 0, 0, 1, 1},  // 4: Ecken
  {1, 1, 0, 1, 0, 1, 1},  // 5: Ecken + Mitte
  {1, 1, 1, 0, 1, 1, 1}   // 6: Alle außer Mitte
};

void setup() {
  pinMode(TASTER_PIN, INPUT);
  for (int i = 0; i < 7; i++) {
    pinMode(LED_PINS[i], OUTPUT);
  }
  randomSeed(analogRead(A0));
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(TASTER_PIN) == HIGH) {
    // Würfel-Animation
    for (int i = 0; i < 10; i++) {
      zeigeZahl(random(1, 7));
      delay(100 + i * 30);
    }

    // Endergebnis
    int ergebnis = random(1, 7);
    zeigeZahl(ergebnis);
    Serial.print("Gewuerfelt: ");
    Serial.println(ergebnis);

    delay(500);  // Entprellung
  }
}

void zeigeZahl(int zahl) {
  for (int i = 0; i < 7; i++) {
    digitalWrite(LED_PINS[i], WUERFEL[zahl - 1][i]);
  }
}
