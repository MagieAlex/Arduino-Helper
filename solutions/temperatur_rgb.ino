/*
 * Projekt 36: Temperaturwarnung mit LED
 * LED wechselt Farbe je nach Temperaturbereich.
 *
 * Schaltung:
 * - RGB-LED: R Pin 9, G Pin 10, B Pin 11
 * - TMP36 an A0
 */

const int ROT_PIN = 9;
const int GRUEN_PIN = 10;
const int BLAU_PIN = 11;
const int TEMP_PIN = A0;

const float KALT_GRENZE = 18.0;   // Unter 18°C = Blau
const float WARM_GRENZE = 25.0;   // Über 25°C = Rot

void setup() {
  pinMode(ROT_PIN, OUTPUT);
  pinMode(GRUEN_PIN, OUTPUT);
  pinMode(BLAU_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  float temperatur = leseTemperatur();

  Serial.print("Temperatur: ");
  Serial.print(temperatur);
  Serial.print(" C -> ");

  if (temperatur < KALT_GRENZE) {
    // Kalt: Blau
    setFarbe(0, 0, 255);
    Serial.println("KALT (Blau)");
  } else if (temperatur > WARM_GRENZE) {
    // Warm: Rot
    setFarbe(255, 0, 0);
    Serial.println("WARM (Rot)");
  } else {
    // Normal: Grün
    setFarbe(0, 255, 0);
    Serial.println("OK (Gruen)");
  }

  delay(500);
}

float leseTemperatur() {
  int sensorWert = analogRead(TEMP_PIN);
  float spannung = sensorWert * (5.0 / 1023.0);
  return (spannung - 0.5) * 100.0;
}

void setFarbe(int r, int g, int b) {
  analogWrite(ROT_PIN, r);
  analogWrite(GRUEN_PIN, g);
  analogWrite(BLAU_PIN, b);
}
