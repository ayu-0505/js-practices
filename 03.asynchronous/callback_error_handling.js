import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
db.run(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books(titl) VALUES(?)", "吾輩は猫である", (err) => {
      // titleをtitlにして処理
      if (err) {
        console.log(err.message);
      }
    }).get("SELECT * FROM book", (err, data) => {
      // booksをbookにして処理
      if (err) {
        console.log(err.message);
      } else {
        console.log(data);
        db.close();
      }
    });
  },
);