import sqlite3 from "sqlite3";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";

export class DatabaseConnector {
  constructor() {
    this.filePath = "./db/memo.db";
  }

  static async initialize() {
    const noteDb = new DatabaseConnector();
    if (!existsSync(noteDb.filePath)) {
      await writeFile(noteDb.filePath, "");
    }

    try {
      await noteDb.#createTable();
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }

    return noteDb;
  }

  addNote(textLines) {
    const db = new sqlite3.Database(this.filePath);
    this.#promiseBasedRun(db, "INSERT INTO notes(title, content) VALUES(?,?)", [
      textLines[0],
      textLines.slice(1).join("\n"),
    ]);
    this.#promiseBasedClose(db);
  }

  async fetchAllNotes() {
    const db = new sqlite3.Database(this.filePath);
    const notes = await this.#promiseBasedAll(
      db,
      "SELECT * FROM notes ORDER BY id ASC",
      [],
    );
    if (notes.length === 0) {
      console.log("There are no notes yet.");
      this.#promiseBasedClose(db);
      return;
    }
    this.#promiseBasedClose(db);
    return notes;
  }

  deleteNote(id) {
    const db = new sqlite3.Database(this.filePath);
    this.#promiseBasedRun(db, "DELETE FROM notes WHERE id = ?", [id]);
    this.#promiseBasedClose(db);
  }

  async #createTable() {
    const db = new sqlite3.Database(this.filePath);
    await this.#promiseBasedRun(
      db,
      "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT)",
    );
    this.#promiseBasedClose(db);
  }

  #promiseBasedRun(db, query, params = []) {
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  #promiseBasedAll(db, query, params = []) {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  #promiseBasedClose(db) {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
