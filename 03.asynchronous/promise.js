import sqlite3 from "sqlite3";

const promiseRun = (query, params = []) => {
  return new Promise((resolve) => {
    db.run(query, params, function () {
      resolve(this);
    });
  });
};

const promiseGet = (query) => {
  return new Promise((resolve) => {
    db.get(query, function (_err, row) {
      resolve(row);
    });
  });
};

const db = new sqlite3.Database(":memory:");
promiseRun(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return promiseRun("INSERT INTO books(title) VALUES(?)", [
      "吾輩は猫である(Promise版)",
    ]);
  })
  .then((state) => {
    console.log(`ID: ${state.lastID}`);
  })
  .then(() => {
    return promiseGet("SELECT * FROM books");
  })
  .then((row) => {
    console.log(row);
  })
  .then(() => {
    db.close();
  });
