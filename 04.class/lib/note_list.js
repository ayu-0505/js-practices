import Enquirer from "enquirer";
import { Input } from "./input.js";

export class NoteList {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
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

  async createNote() {
    const input = new Input();
    try {
      const textLines = await input.askNote();
      if (textLines.length === 0) {
        return;
      }
      this.dbConnector.addNote(textLines);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  async #selectNote(messageText, callback) {
    try {
      const notes = await this.dbConnector.fetchAllNotes();
      if (!notes) {
        return;
      }
      const selectedNote = await this.#askUserSelection(notes, messageText);
      callback(selectedNote);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  async #askUserSelection(notes, messageText) {
    const question = {
      type: "select",
      name: "userSelection",
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
    return answer.userSelection;
  }
}
