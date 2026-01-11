/*
 * Projekt 26: Alarmanlage mit Bewegungsmelder
 * PIR-Sensor erkennt Bewegung und aktiviert LED + Summer.
 *
 * Schaltung:
 * - PIR OUT an Pin 2
 * - LED an Pin 13
 * - Piezo an Pin 8
 */

const int PIR_PIN = 2;
const int LED_PIN = 13;
const int PIEZO_PIN = 8;

void setup() {
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Alarmanlage aktiv");
  delay(2000);  // PIR Aufwärmzeit
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    Serial.println("BEWEGUNG ERKANNT!");

    // Alarm auslösen
    for (int i = 0; i < 10; i++) {
      digitalWrite(LED_PIN, HIGH);
      tone(PIEZO_PIN, 1000);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      tone(PIEZO_PIN, 500);
      delay(100);
    }
    noTone(PIEZO_PIN);
  }

  delay(100);
}
