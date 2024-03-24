import { Args, Flags } from "@oclif/core";
import chalk from "chalk";
import { ApiCommand } from "../../apiCommand.js";

export default class Logs extends ApiCommand<typeof Logs> {
  static args = {
    funcId: Args.string({
      description: "The Function ID to get the logs for",
      required: true,
    }),
  };

  static description = "Get all logs tied to one function.";

  static flags = {
    apiUrl: Flags.string({
      char: "u",
      description: "The url to the api gateway for this call",
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Logs);
    const url = await this.getUrl();

    let data: any[];

    try {
      const res = await fetch(url + `/logs/functions/${args.funcId}?limit=-1`);

      if (res.status === 404) {
        this.error(
          `${chalk.red("[FAIL]")} Function with id ${
            args.funcId
          } does not exist`
        );
      }

      if (res.status === 500) {
        this.error(
          `${chalk.red("[FAIL]")} Internal Server Error, try again later`
        );
      }

      data = await res.json();
    } catch {
      this.error(`${chalk.red("[FAIL]")} Cannot connect to ${url}.`);
    }

    this.log(
      `${chalk.greenBright("[Success]")} Function ID ${args.funcId} logs:\n`
    );

    for (const log of data) {
      this.logJson(log);
      this.log();
    }
  }
}