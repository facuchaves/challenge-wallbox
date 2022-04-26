import WebSocket from "ws";

const chargerDeviceMap = new Map<string, string>();
chargerDeviceMap.set("c0001", "d0001");
chargerDeviceMap.set("c0002", "d0002");
chargerDeviceMap.set("c0003", "d0003");

let device_d0001Ws: WebSocket | null = null;

function startChargersServer(port = 3100): Promise<WebSocket.Server> {
  return new Promise((resolve) => {
    const wss = new WebSocket.Server({ port });

    wss.on("connection", (ws, req) => {
      console.log("Charger connection to: ", req.url);

      if (req.url === "/chargers/c0001") {
        ws.on("message", (message: string) => {
          console.log(`Received message from charger ${req.url}: ${message}`);

          const parsedMessage: { event: string; data: { soc: number } } =
            JSON.parse(message);

          if (device_d0001Ws) {
            if (parsedMessage.event === "StateOfCharge") {
              const toDeviceMessage = {
                event: "ChargingStatus",
                data: {
                  status: "charged",
                },
              };

              if (parsedMessage.data.soc < 80) {
                toDeviceMessage.data.status = "charging";
              } else if (parsedMessage.data.soc < 100) {
                toDeviceMessage.data.status = "charging80";
              }

              device_d0001Ws.send(JSON.stringify(toDeviceMessage));
            }
          }
        });
      }

      ws.on("close", () => {
        console.log("charger connection closed", req.url);
      });
    });

    wss.on("listening", () => {
      resolve(wss);
    });
  });
}

function startDevicesServer(port = 3200): Promise<WebSocket.Server> {
  return new Promise((resolve) => {
    const wss = new WebSocket.Server({ port });

    wss.on("connection", (ws, req) => {
      console.log("Device connection to: ", req.url);
      if (req.url === "/devices/d0001") {
        device_d0001Ws = ws;
      }

      ws.on("close", () => {
        console.log("Device connection closed", req.url);
      });
    });

    wss.on("listening", () => {
      resolve(wss);
    });
  });
}

export function startServer(): Promise<WebSocket.Server[]> {
  return Promise.all([startChargersServer(), startDevicesServer()]);
}

export function stopServer(servers: WebSocket.Server[] | null): Promise<any> {
  if (Array.isArray(servers)) {
    return Promise.all(servers.map((server) => server.close()));
  } else {
    return Promise.resolve();
  }
}
