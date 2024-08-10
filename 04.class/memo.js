#! /usr/bin/env node

import minimist from "minimist";
import { NoteDatabase } from "./lib/note_database.js";
import { NoteList } from "./lib/note_list.js";

class MemoApp {
  async run() {
    const noteDatabase = await NoteDatabase.initialize();
    const noteList = new NoteList(noteDatabase);
    const options = minimist(process.argv.slice(2));
    if (options.l) {
      await noteList.seeAllTitles();
    } else if (options.r) {
      await noteList.seeNote();
    } else if (options.d) {
      await noteList.deleteNote();
    } else {
      await noteList.createNote();
    }
  }
}

const main = new MemoApp();
main.run();
