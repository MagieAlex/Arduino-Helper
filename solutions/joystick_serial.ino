/*
 * Projekt 17: Joystick auf seriellem Monitor
 * X/Y-Achsen und Button werden im Serial Monitor ausgegeben.
 *
 * Schaltung:
 * - VRx an A0, VRy an A1
 * - SW (Button) an Pin 2
 * - +5V und GND
 */

const int VRX_PIN = A0;
const int VRY_PIN = A1;
const int SW_PIN = 2;

void setup() {
  pinMode(SW_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int xWert = analogRead(VRX_PIN);
  int yWert = analogRead(VRY_PIN);
  int button = digitalRead(SW_PIN);

  Serial.print("X: ");
  Serial.print(xWert);
  Serial.print(" | Y: ");
  Serial.print(yWert);
  Serial.print(" | Button: ");
  Serial.println(button == LOW ? "GEDRUECKT" : "---");

  delay(100);
}
