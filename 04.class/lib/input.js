import readline from "readline";

export class Input {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async ask() {
    const textLines = [];
    await this.#promiseBasedReadlineOn("line", (input, resolve) => {
      if (input === "EOF") {
        this.rl.close();
        if (textLines.length === 0) {
          resolve();
          return;
        }
        if (!textLines[0]) {
          textLines[0] = "NoTitle";
        }
        resolve();
      } else {
        textLines.push(input);
      }
    });
    return textLines;
  }

  #promiseBasedReadlineOn = (event, callback) => {
    return new Promise((resolve) => {
      this.rl.on(event, (input) => {
        callback(input, resolve);
      });
    });
  };
}
