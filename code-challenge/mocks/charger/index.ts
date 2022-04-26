import { createChargerMock } from "./charger.mock";
import { createSoCPrompter } from "./soc.prompter";

import yargs from "yargs";

let options = yargs(process.argv.slice(2))
  .usage("Usage: $0 -i <chargerId>")
  .example("$0 -i c1234 -u ws://localhost:3100/chargers", "set all params")
  .example("$0 -i c1234", "use default url")
  .example("$0", "use default url and charger")
  .option("i", {
    alias: "id",
    describe: "The charger ID",
    type: "string",
    default: "c0001",
  })
  .option("u", {
    alias: "url",
    describe: "The websocket endpoint",
    type: "string",
    default: "ws://localhost:3100/chargers",
  })
  .help("h")
  .alias("h", "help").argv as { u: string; i: string };

const chargerMock = createChargerMock({ id: options.i, url: options.u });
chargerMock.start();

const soCPrompter = createSoCPrompter({
  socsSubject: chargerMock.getSocSubject(),
});
soCPrompter.startPrompting();
