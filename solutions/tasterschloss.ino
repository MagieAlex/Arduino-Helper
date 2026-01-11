/*
 * Projekt 37: Taster-Kombination als Schloss
 * Nur richtige Tasterkombination (1-2-1) schaltet LED frei.
 *
 * Schaltung:
 * - Taster 1 an Pin 2, Taster 2 an Pin 3
 * - Rote LED (gesperrt) an Pin 12
 * - Grüne LED (offen) an Pin 13
 */

const int TASTER1 = 2;
const int TASTER2 = 3;
const int LED_ROT = 12;
const int LED_GRUEN = 13;

// Geheimcode: 1-2-1 (Taster1, Taster2, Taster1)
const int CODE[] = {1, 2, 1};
const int CODE_LAENGE = 3;

int eingabe[3] = {0, 0, 0};
int position = 0;
bool letzterT1 = LOW, letzterT2 = LOW;

void setup() {
  pinMode(TASTER1, INPUT);
  pinMode(TASTER2, INPUT);
  pinMode(LED_ROT, OUTPUT);
  pinMode(LED_GRUEN, OUTPUT);

  digitalWrite(LED_ROT, HIGH);  // Start: Gesperrt
  Serial.begin(9600);
  Serial.println("Schloss aktiv. Code eingeben...");
}

void loop() {
  bool t1 = digitalRead(TASTER1);
  bool t2 = digitalRead(TASTER2);

  // Taster 1 gedrückt
  if (t1 == HIGH && letzterT1 == LOW) {
    eingabe[position] = 1;
    position++;
    Serial.print("Eingabe: 1 (Position ");
    Serial.print(position);
    Serial.println(")");
    delay(200);
  }

  // Taster 2 gedrückt
  if (t2 == HIGH && letzterT2 == LOW) {
    eingabe[position] = 2;
    position++;
    Serial.print("Eingabe: 2 (Position ");
    Serial.print(position);
    Serial.println(")");
    delay(200);
  }

  // Code vollständig eingegeben?
  if (position >= CODE_LAENGE) {
    if (pruefeCode()) {
      Serial.println("CODE KORREKT - OFFEN!");
      digitalWrite(LED_ROT, LOW);
      digitalWrite(LED_GRUEN, HIGH);
      delay(5000);  // 5 Sekunden offen
    } else {
      Serial.println("FALSCHER CODE!");
      // LED blinkt als Warnung
      for (int i = 0; i < 3; i++) {
        digitalWrite(LED_ROT, LOW);
        delay(200);
        digitalWrite(LED_ROT, HIGH);
        delay(200);
      }
    }

    // Reset
    position = 0;
    digitalWrite(LED_ROT, HIGH);
    digitalWrite(LED_GRUEN, LOW);
  }

  letzterT1 = t1;
  letzterT2 = t2;
}

bool pruefeCode() {
  for (int i = 0; i < CODE_LAENGE; i++) {
    if (eingabe[i] != CODE[i]) return false;
  }
  return true;
}
