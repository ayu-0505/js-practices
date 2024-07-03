import sqlite3 from "sqlite3";
import { promiseRun, promiseGet } from "./promisify_db_functions.js";

const db = new sqlite3.Database(":memory:");

(async () => {
  await promiseRun(
    db,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  const state = await promiseRun(db, "INSERT INTO books(title) VALUES(?)", [
    "吾輩は猫である(async/await版)",
  ]);
  console.log(`ID: ${state.lastID}`);
  const data = await promiseGet(db, "SELECT * FROM books");
  console.log(data);
  db.close();
})();
