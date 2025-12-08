import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import path from "path";
import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ---------- TWILIO SETUP ----------
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM_WHATSAPP = process.env.TWILIO_WHATSAPP_FROM;
const TO_WHATSAPP = process.env.TWILIO_WHATSAPP_TO;

// ---------- ALERT THRESHOLDS ----------
const TEMP_THRESHOLD = 30; // °C
const HUM_THRESHOLD = 70; // %

let db;

// ---------- DATABASE SETUP ----------
async function initDB() {
db = await open({
filename: "./weather.db",
driver: sqlite3.Database,
});

await db.exec(`     CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      humidity REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

console.log("📁 Database ready");
}

// ---------- SERVE FRONTEND ----------
app.use(express.static(path.join(process.cwd(), "public")));

// ---------- ROUTES ----------

// Receive readings
app.post("/data", async (req, res) => {
const { temperature, humidity } = req.body;

if (temperature === undefined || humidity === undefined) {
return res.status(400).json({ error: "Temperature or humidity missing" });
}

// Store in database
await db.run(
"INSERT INTO readings (temperature, humidity) VALUES (?, ?)",
temperature,
humidity
);

console.log(`📩 Received: Temp=${temperature}, Hum=${humidity}`);

// Check for alerts
if (temperature > TEMP_THRESHOLD) {
try {
await client.messages.create({
from: FROM_WHATSAPP,
to: TO_WHATSAPP,
body: `⚠️ Temperature Alert! Current: ${temperature}°C`
});
console.log("🚨 Temperature alert sent!");
} catch (err) {
console.error("❌ Error sending temperature alert:", err.message);
}
}

if (humidity > HUM_THRESHOLD) {
try {
await client.messages.create({
from: FROM_WHATSAPP,
to: TO_WHATSAPP,
body: `⚠️ Humidity Alert! Current: ${humidity}%`
});
console.log("🚨 Humidity alert sent!");
} catch (err) {
console.error("❌ Error sending humidity alert:", err.message);
}
}

res.json({ status: "ok" });
});

// Send last 50 readings to frontend
app.get("/data", async (req, res) => {
try {
const rows = await db.all("SELECT * FROM readings ORDER BY id DESC LIMIT 50");
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Database error" });
}
});

// ---------- START SERVER ----------
const PORT = 3000;
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
});

await initDB();

