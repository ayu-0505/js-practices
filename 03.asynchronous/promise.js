import sqlite3 from "sqlite3";
import { promiseRun, promiseGet } from "./promise_functions.js";

const db = new sqlite3.Database(":memory:");
promiseRun(
  db,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    promiseRun(db, "INSERT INTO books(title) VALUES(?)", [
      "吾輩は猫である(Promise版)",
    ]),
  )
  .then((state) => console.log(`ID: ${state.lastID}`))
  .then(() => promiseGet(db, "SELECT * FROM books"))
  .then((row) => console.log(row))
  .finally(() => db.close());
