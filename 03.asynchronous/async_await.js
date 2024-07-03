import sqlite3 from "sqlite3";
import { promiseRun, promiseGet } from "./promisify_db_functions.js";

const db = new sqlite3.Database(":memory:");

await promiseRun(
  db,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const details = await promiseRun(db, "INSERT INTO books(title) VALUES(?)", [
  "吾輩は猫である(async/await版)",
]);
console.log(`ID: ${details.lastID}`);
const row = await promiseGet(db, "SELECT * FROM books");
console.log(row);
db.close();
