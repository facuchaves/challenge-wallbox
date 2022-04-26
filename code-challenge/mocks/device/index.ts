import { createDeviceMock } from "./device.mock";

import yargs from "yargs";

const options = yargs(process.argv.slice(2))
  .usage("Usage: -i <chargerId> -u <url>")
  .example("$0 -i d1234 -u ws://localhost:3100/devices", "set all params")
  .example("$0 -i d1234", "use default url")
  .example("$0", "use default url and device")
  .option("i", {
    alias: "id",
    describe: "The device ID",
    type: "string",
    default: "d0001",
  })
  .option("u", {
    alias: "url",
    describe: "The websocket endpoint",
    type: "string",
    default: "ws://localhost:3200/devices",
  }).argv as { u: string; i: string };

const deviceMock = createDeviceMock({ id: options.i, url: options.u });
deviceMock.start();
