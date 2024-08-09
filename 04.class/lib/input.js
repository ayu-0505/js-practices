import readline from "readline";

export class Input {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async askNote() {
    const lines = [];
    await this.#promiseBasedReadlineOn("line", (input, resolve) => {
      if (input === "EOF") {
        this.rl.close();
        if (lines.length === 0) {
          resolve();
          return;
        }
        if (!lines[0]) {
          lines[0] = "NoTitle";
        }
        resolve();
      } else {
        lines.push(input);
      }
    });
    return lines;
  }

  #promiseBasedReadlineOn = (event, callback) => {
    return new Promise((resolve) => {
      this.rl.on(event, (input) => {
        callback(input, resolve);
      });
    });
  };
}
