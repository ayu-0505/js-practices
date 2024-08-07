#! /usr/bin/env node
import minimist from "minimist";
import * as fs from "node:fs/promises";
import { DatabaseConnector } from "./lib/database_connector.js";
import { NoteList } from "./lib/note_list.js";

const filePath = "./db/memo.db";

async function createDatabase() {
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, "");
  }
}

// noteList.createTable();
const dbConnector = new DatabaseConnector();

async function createTable() {
  try {
    dbConnector.createTable();
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR") {
      console.error(err);
    } else {
      throw err;
    }
  } finally {
    // this.dbConnector.close();
  }
}
createDatabase();
createTable();

const noteList = new NoteList(dbConnector);
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
