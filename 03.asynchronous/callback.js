import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
db.run(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books(title) VALUES(?)",
      ["吾輩は猫である"],
      function () {
        console.log(`ID: ${this.lastID}`);
        db.get("SELECT * FROM books", (_err, row) => {
          console.log(row);
          db.close();
        });
      },
    );
  },
);
