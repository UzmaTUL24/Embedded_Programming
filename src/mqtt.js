import mqtt from "mqtt";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// ---------- TWILIO SETUP ----------
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM_WHATSAPP = process.env.TWILIO_WHATSAPP_FROM;
const TO_WHATSAPP = process.env.TWILIO_WHATSAPP_TO;

// ---------- ALERT THRESHOLDS ----------
const TEMP_THRESHOLD = 30; // °C
const HUM_THRESHOLD = 70; // %

// ---------- DATABASE SETUP ----------
let db;
async function initDB() {
  db = await open({
    filename: "./weather.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      humidity REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("📁 Database & Table ready");
}

// ---------- MQTT SETUP ----------
async function start() {
  await initDB();

  const broker = process.env.MQTT_BROKER;
  const topic = process.env.MQTT_TOPIC;
  const mqttClient = mqtt.connect(broker);

  mqttClient.on("connect", () => {
    console.log(`✅ MQTT Connected to: ${broker}`);
    mqttClient.subscribe(topic, () => {
      console.log(`📡 Subscribed to topic: ${topic}`);
    });
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const { temperature, humidity } = JSON.parse(message.toString());
      console.log(`🌡️ Received: ${temperature} °C / ${humidity} %`);

      // Get last reading
      const lastRow = await db.get("SELECT temperature, humidity FROM readings ORDER BY id DESC LIMIT 1");

      // Save to DB only if value changed
      if (!lastRow || lastRow.temperature !== temperature || lastRow.humidity !== humidity) {
        await db.run(
          "INSERT INTO readings (temperature, humidity) VALUES (?, ?)",
          temperature,
          humidity
        );
        console.log("💾 Saved to DB (value changed)");

        // Send alerts
        if (temperature > TEMP_THRESHOLD) {
          await client.messages.create({
            from: FROM_WHATSAPP,
            to: TO_WHATSAPP,
            body: `⚠️ Temperature Alert! Current: ${temperature}°C`
          });
          console.log(`🚨 Temperature alert sent! Current temperature: ${temperature}°C ✅`);
        }

        if (humidity > HUM_THRESHOLD) {
          await client.messages.create({
            from: FROM_WHATSAPP,
            to: TO_WHATSAPP,
            body: `⚠️ Humidity Alert! Current: ${humidity}%`
          });
          console.log(`🚨 Humidity alert sent! Current humidity: ${humidity}% ✅`);
        }
      }

    } catch (err) {
      console.error("❌ Error handling MQTT message:", err);
    }
  });
}

start();
5