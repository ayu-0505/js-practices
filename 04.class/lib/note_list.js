import readline from "readline";
import Enquirer from "enquirer";

export class NoteList {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
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
    } finally {
      this.dbConnector.close();
    }
  }

  async seeAllTitles() {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      notes.forEach((note) => console.log(note.title));
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    } finally {
      this.dbConnector.close();
    }
  }

  async seeNote() {
    this.#selectNote("Choose a note you want to see:", (note) => {
      console.log(note.title);
      console.log(note.content);
    });
  }

  async deleteNote() {
    this.#selectNote("Choose a memo you want to delete", (note) => {
      this.dbConnector.deleteNote(note.id);
    });
  }

  #promiseBasedReadlineOn = (rl, event, callback) => {
    return new Promise((resolve) => {
      rl.on(event, (input) => {
        callback(input, resolve);
      });
    });
  };

  async #userSelect(notes, messageText) {
    const question = {
      type: "select",
      name: "toSeeNote",
      message: messageText,
      choices: notes.map((note) => ({
        name: note.title,
        value: note,
      })),
      result() {
        return this.focused.value;
      },
    };
    const answer = await Enquirer.prompt(question);
    return answer.toSeeNote;
  }

  async #selectNote(messageText, callback) {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      const note = await this.#userSelect(notes, messageText);
      callback(note);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    } finally {
      this.dbConnector.close();
    }
  }
}
