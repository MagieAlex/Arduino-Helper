/*
 * Projekt 31: Reaktionsspiel
 * LED leuchtet zufällig auf, Spieler muss schnell Taster drücken.
 *
 * Schaltung:
 * - LED an Pin 13
 * - Taster an Pin 2
 */

const int LED_PIN = 13;
const int TASTER_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(TASTER_PIN, INPUT);
  Serial.begin(9600);
  randomSeed(analogRead(A0));  // Zufallsgenerator initialisieren
  Serial.println("Reaktionsspiel - Druecke Taster wenn LED leuchtet!");
}

void loop() {
  Serial.println("\nWarte...");
  digitalWrite(LED_PIN, LOW);

  // Zufällige Wartezeit (2-5 Sekunden)
  delay(random(2000, 5000));

  // LED einschalten und Zeit messen
  digitalWrite(LED_PIN, HIGH);
  unsigned long startZeit = millis();

  // Warten auf Tasterdruck
  while (digitalRead(TASTER_PIN) == LOW) {
    // Timeout nach 3 Sekunden
    if (millis() - startZeit > 3000) {
      Serial.println("Zu langsam! Timeout.");
      break;
    }
  }

  unsigned long reaktionszeit = millis() - startZeit;
  digitalWrite(LED_PIN, LOW);

  if (reaktionszeit <= 3000) {
    Serial.print("Reaktionszeit: ");
    Serial.print(reaktionszeit);
    Serial.println(" ms");

    if (reaktionszeit < 200) Serial.println("Ausgezeichnet!");
    else if (reaktionszeit < 300) Serial.println("Sehr gut!");
    else if (reaktionszeit < 500) Serial.println("Gut!");
    else Serial.println("Ueben macht den Meister!");
  }

  delay(2000);
}
