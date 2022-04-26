import { startServer, stopServer } from "../lib/server";

import { Server } from "ws";

let server: Server[] | null = null;

before(async () => {
  server = await startServer();
  console.log("Servers ON");
});

after(async () => {
  await stopServer(server);
  console.log("Servers STOPPED");
});
