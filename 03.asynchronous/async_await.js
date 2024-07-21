import sqlite3 from "sqlite3";
import {
  promiseRun,
  promiseGet,
  promiseClose,
} from "./promise_based_db_functions.js";

const db = new sqlite3.Database(":memory:");

await promiseRun(
  db,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const update = await promiseRun(db, "INSERT INTO books(title) VALUES(?)", [
  "吾輩は猫である(async/await版)",
]);
console.log(`ID: ${update.lastID}`);
const row = await promiseGet(db, "SELECT * FROM books");
console.log(row);
await promiseClose(db);
