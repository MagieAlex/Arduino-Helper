/*
 * Projekt 12: Ampelsteuerung Tag/Nacht
 * Ampel wechselt nachts in Blinkbetrieb (gelbes Blinken).
 *
 * Schaltung:
 * - Rot Pin 10, Gelb Pin 11, Grün Pin 12
 * - LDR + 10kΩ als Spannungsteiler an A0
 */

const int ROT_PIN = 10;
const int GELB_PIN = 11;
const int GRUEN_PIN = 12;
const int LDR_PIN = A0;
const int NACHT_SCHWELLE = 200;

void setup() {
  pinMode(ROT_PIN, OUTPUT);
  pinMode(GELB_PIN, OUTPUT);
  pinMode(GRUEN_PIN, OUTPUT);
}

void loop() {
  int helligkeit = analogRead(LDR_PIN);

  if (helligkeit < NACHT_SCHWELLE) {
    // Nachtmodus: Gelb blinkt
    nachtModus();
  } else {
    // Tagmodus: Normale Ampelschaltung
    tagModus();
  }
}

void nachtModus() {
  digitalWrite(ROT_PIN, LOW);
  digitalWrite(GRUEN_PIN, LOW);
  digitalWrite(GELB_PIN, HIGH);
  delay(500);
  digitalWrite(GELB_PIN, LOW);
  delay(500);
}

void tagModus() {
  // Rot
  digitalWrite(ROT_PIN, HIGH);
  digitalWrite(GELB_PIN, LOW);
  digitalWrite(GRUEN_PIN, LOW);
  if (checkNacht()) return;
  delay(3000);

  // Rot-Gelb
  digitalWrite(GELB_PIN, HIGH);
  if (checkNacht()) return;
  delay(1000);

  // Grün
  digitalWrite(ROT_PIN, LOW);
  digitalWrite(GELB_PIN, LOW);
  digitalWrite(GRUEN_PIN, HIGH);
  if (checkNacht()) return;
  delay(3000);

  // Gelb
  digitalWrite(GRUEN_PIN, LOW);
  digitalWrite(GELB_PIN, HIGH);
  if (checkNacht()) return;
  delay(1000);
}

bool checkNacht() {
  return analogRead(LDR_PIN) < NACHT_SCHWELLE;
}
