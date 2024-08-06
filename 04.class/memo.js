#! /usr/bin/env node
import minimist from "minimist";
import { NoteList } from "./lib/note_list.js";

const noteList = new NoteList();

noteList.createTable();

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
