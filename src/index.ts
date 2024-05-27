import app from "./app";
import { createServer } from "http";

import config from "./config";

const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null);

class Index {
  private static server = createServer(app);

  public static async start(): Promise<void> {
    await this.listen();
    console.log(`listening at :${config.port}`);

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
        if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
    console.log(`HTTP RESULT `, JSON.stringify(results));
  
  }

  private static listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.on("listening", resolve);
      this.server.on("error", (err: any) => {
        console.error(err);
        reject(err);
      });
      this.server.listen(config.port);
    });
  }
}

Index.start().catch((err) => {
  console.error(err);
});