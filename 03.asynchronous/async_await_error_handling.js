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
try {
  // titleをtitlにして処理
  await promiseRun(db, "INSERT INTO books(titl) VALUES(?)", [
    "吾輩は猫である(async/await版)",
  ]);
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  // booksをbookにして処理
  await promiseGet(db, "SELECT * FROM book");
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await promiseClose(db);
