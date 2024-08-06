import readline from "readline";
import { DatabaseConnector } from "./database_connector.js";
import { NoteList } from "./note_list.js";

export class Controller {
  constructor() {
    this.dbConnector = new DatabaseConnector();
  }

  async createTable() {
    try {
      this.dbConnector.createTable();
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  async seeAllTitles() {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      const noteList = new NoteList(notes);
      noteList.seeAllTitles();
      this.dbConnector.close();
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
        this.dbConnector.close();
      } else {
        throw err;
      }
    }
  }

  async seeNote() {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      const noteList = new NoteList(notes);
      const note = await noteList.selectNote("Choose a note you want to see:");
      console.log(note.title);
      console.log(note.content);
      this.dbConnector.close();
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
        this.dbConnector.close();
      } else {
        throw err;
      }
    }
  }

  async deleteNote() {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      const noteList = new NoteList(notes);
      const note = await noteList.selectNote(
        "Choose a memo you want to delete:",
      );
      this.dbConnector.deleteNote(note.id);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  async createNote() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const lines = [];

    try {
      await this.#promiseBasedReadlineOn(rl, "line", (input, resolve) => {
        if (input === "EOF") {
          if (lines.length === 0) {
            rl.close();
            resolve();
            return;
          }
          if (!lines[0]) {
            lines[0] = "NoTitle";
          }
          this.dbConnector.addNote(lines);
          rl.close();
          resolve();
        } else {
          lines.push(input);
        }
      });
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  #promiseBasedReadlineOn = (rl, event, callback) => {
    return new Promise((resolve) => {
      rl.on(event, (input) => {
        callback(input, resolve);
      });
    });
  };
}
