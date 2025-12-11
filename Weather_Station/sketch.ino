#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ---------- DHT22 Setup ----------
#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ---------- LEDs ----------
const int greenLed = 2;
const int redLed = 4;

// ---------- Wi-Fi ----------
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// ---------- MQTT ----------
const char* mqtt_server = "test.mosquitto.org";
const char* topic = "weather/station";

WiFiClient espClient;
PubSubClient client(espClient);

// ---------- Functions ----------
void setupWiFi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Wi-Fi Connected!");
  digitalWrite(greenLed, HIGH);
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("esp32-weather-client")) {
      Serial.println("connected!");
      client.subscribe(topic);
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 3 seconds...");
      delay(3000);
    }
  }
}

// ---------- Setup ----------
void setup() {
  Serial.begin(115200);

  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, LOW);

  dht.begin();

  setupWiFi();

  client.setServer(mqtt_server, 1883);
}

// ---------- Loop ----------
void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Read temperature and humidity
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("❌ Failed to read sensor!");
    digitalWrite(redLed, HIGH);
    delay(2000);
    return;
  }

  // Print readings
  Serial.print("🌡 Temp: ");
  Serial.print(temp);
  Serial.print(" °C   💧 Hum: ");
  Serial.println(hum);

  // Prepare JSON payload
  char payload[100];
  sprintf(payload, "{\"temperature\": %.2f, \"humidity\": %.2f}", temp, hum);

  // Publish MQTT message
  if (client.publish(topic, payload)) {
    Serial.println("📡 MQTT Published!");
    digitalWrite(redLed, LOW);
  } else {
    Serial.println("⚠️ MQTT Publish FAILED!");
    digitalWrite(redLed, HIGH);
  }

  delay(10000); // Publish every 10 seconds
}
