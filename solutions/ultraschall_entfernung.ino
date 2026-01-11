/*
 * Projekt 27: Entfernungsmessung mit Ultraschall
 * HC-SR04 misst Entfernung und gibt sie im Serial Monitor aus.
 *
 * Schaltung:
 * - Trig an Pin 9, Echo an Pin 10
 * - VCC an 5V, GND an GND
 */

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("Ultraschall-Entfernungsmessung");
}

void loop() {
  // Trigger-Impuls senden
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Echo-Zeit messen
  long dauer = pulseIn(ECHO_PIN, HIGH);

  // Entfernung berechnen (Schall: 343 m/s)
  float entfernung = dauer * 0.034 / 2;

  Serial.print("Entfernung: ");
  Serial.print(entfernung);
  Serial.println(" cm");

  delay(500);
}
