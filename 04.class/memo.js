#! /usr/bin/env node

import minimist from "minimist";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { DatabaseConnector } from "./lib/database_connector.js";
import { NoteList } from "./lib/note_list.js";

class MemoApp {
  constructor() {
    this.filePath = "./db/memo.db";
    this.dbConnector = null;
  }

  static async initialize() {
    const memoApp = new MemoApp();

    if (!existsSync(memoApp.filePath)) {
      await writeFile(memoApp.filePath, "");
    }

    memoApp.dbConnector = new DatabaseConnector(memoApp.filePath);
    try {
      await memoApp.dbConnector.createTable();
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err);
      } else {
        throw err;
      }
    }

    return memoApp;
  }

  async run() {
    const noteList = new NoteList(this.dbConnector);
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

const main = async () => {
  const memoApp = await MemoApp.initialize();
  memoApp.run();
};

main();
