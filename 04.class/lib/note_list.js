import Enquirer from "enquirer";
import { Input } from "./input.js";

export class NoteList {
  constructor(noteDatabase) {
    this.noteDatabase = noteDatabase;
  }

  async seeAll() {
    try {
      const notes = await this.noteDatabase.fetchAll();
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

  async see() {
    this.#select("Choose a note you want to see:", (note) => {
      console.log(note.title);
      console.log(note.content);
    });
  }

  async delete() {
    this.#select("Choose a memo you want to delete", (note) => {
      this.noteDatabase.delete(note.id);
    });
  }

  async create() {
    const input = new Input();
    try {
      const textLines = await input.ask();
      if (textLines.length === 0) {
        return;
      }
      this.noteDatabase.add(textLines);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  async #select(messageText, callback) {
    try {
      const notes = await this.noteDatabase.fetchAll();
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
