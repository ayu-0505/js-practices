import sqlite3 from "sqlite3";

const promiseRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const promiseGet = (query) => {
  return new Promise((resolve, reject) => {
    db.get(query, function (err, row) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const db = new sqlite3.Database(":memory:");
promiseRun(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    // titleをtitlにして処理
    return promiseRun("INSERT INTO books(titl) VALUES(?)", [
      "吾輩は猫である(Promise版)",
    ]);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    // booksをbookにして処理
    return promiseGet("SELECT * FROM book");
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    db.close();
  });
