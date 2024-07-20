import sqlite3 from "sqlite3";
import {
  promiseRun,
  promiseGet,
  promiseClose,
} from "./db_functions_wrapped_by_promise.js";

const db = new sqlite3.Database(":memory:");

promiseRun(
  db,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    // titleをtitlにして処理
    promiseRun(db, "INSERT INTO books(titl) VALUES(?)", [
      "吾輩は猫である(Promise版)",
    ]),
  )
  .catch((err) => {
    console.error(err.message);
  })
  .then(() =>
    // booksをbookにして処理
    promiseGet(db, "SELECT * FROM book"),
  )
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => promiseClose(db));
