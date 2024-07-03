import sqlite3 from "sqlite3";
import { promiseRun, promiseGet } from "./promisify_db_functions.js";

const db = new sqlite3.Database(":memory:");

(async () => {
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
    console.error(error.message);
  }
  try {
    // booksをbookにして処理
    await promiseGet(db, "SELECT * FROM book");
  } catch (error) {
    console.error(error.message);
  }
  db.close();
})();