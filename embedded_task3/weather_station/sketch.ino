#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>


const char* ssid = "Wokwi-GUEST";     
const char* password = "";           

// ThingSpeak p 
String apiKey = "69V6T79HCO97KN1E";   
const char* server = "https://api.thingspeak.com/update";

//  DHT22 Sensor
#define DHTPIN 15        
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// LED 
const int greenLed = 2;    
const int redLed = 4;      

void setup() {
  Serial.begin(115200);
  
  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, LOW);

  dht.begin();

  // Connect to Wi-Fi
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n Wi-Fi Connected!");
  digitalWrite(greenLed, HIGH);
}

void loop() {
  // Read temperature
  float temp = dht.readTemperature();

  // Check for valid reading
  if (isnan(temp)) {
    Serial.println(" Failed to read from DHT sensor!");
    digitalWrite(redLed, HIGH);
    delay(2000);
    return;
  }

  Serial.print(" Temperature: ");
  Serial.print(temp);
  Serial.println(" °C");

  // Send to ThingSpeak
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(server) + "?api_key=" + apiKey + "&field1=" + String(temp);

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.println(" Data sent to ThingSpeak!");
      digitalWrite(redLed, LOW);
    } else {
      Serial.println(" Error sending data!");
      digitalWrite(redLed, HIGH);
    }
    http.end();
  } else {
    Serial.println(" Wi-Fi not connected!");
    digitalWrite(redLed, HIGH);
  }

  delay(15000);
}
