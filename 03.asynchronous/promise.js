import sqlite3 from "sqlite3";
import {
  promiseRun,
  promiseGet,
  promiseClose,
} from "./promise_based_db_functions.js";

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
  .then((insert) => {
    console.log(`ID: ${insert.lastID}`);
    return promiseGet(db, "SELECT * FROM books");
  })
  .then((row) => {
    console.log(row);
    return promiseClose(db);
  });
