import sqlite3 from "sqlite3";
import { open } from "sqlite";

// -----------------------------
// OPEN DATABASE
// -----------------------------
const dbPromise = open({
  filename: "./weather.db",
  driver: sqlite3.Database,
});

// -----------------------------
// CREATE TABLE IF NOT EXISTS
// -----------------------------
async function createTable() {
  const db = await dbPromise;
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

createTable();

// -----------------------------
// SAVE A NEW SENSOR READING
// -----------------------------
export async function saveReading(temperature, humidity) {
  const db = await dbPromise;
  await db.run(
    `INSERT INTO readings (temperature, humidity) VALUES (?, ?)`,
    [temperature, humidity]
  );
}

// -----------------------------
// GET ALL READINGS
// -----------------------------
export async function getReadings() {
  const db = await dbPromise;
  const rows = await db.all(`SELECT * FROM readings ORDER BY timestamp DESC`);
  return rows;
}
