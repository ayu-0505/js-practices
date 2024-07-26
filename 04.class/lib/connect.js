import sqlite3 from "sqlite3";

export class Connect {
  constructor() {
    this.db = new sqlite3.Database("./db/memo.db");
  }

  createTable() {
    this.#promiseBasedRun(
      "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT)",
    );
  }

  addNote(lines) {
    this.#promiseBasedRun("INSERT INTO notes(title, content) VALUES(?,?)", [
      lines[0],
      lines.slice(1).join("\n"),
    ]);
  }

  fetchAllNotes() {
    return this.#promiseBasedAll("SELECT * FROM notes", []);
  }

  deleteNote(id) {
    this.#promiseBasedRun("DELETE FROM notes WHERE id = ?", [id]);
  }

  close() {
    this.#promiseBasedClose();
  }

  #promiseBasedRun(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  #promiseBasedAll(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  #promiseBasedClose() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
