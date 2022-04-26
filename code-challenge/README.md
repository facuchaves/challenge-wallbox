# Code challenge

## Context

Wallbox is thinking of diversifying its business, and for this, it is going to launch a new mobile phone recharge service for various events: music festivals and the like.

The charging process will be as follows:

A customer approaches the Wallbox booth, hands over a mobile phone and in return receives a device (aka _beeper_) that will indicate the status of the charging process. This device has a LED that changes color depending on the state of the charge:

     - red: charging
     - yellow: charge level at least 80%
     - green: fully charged

When the LED turns green, the customer can return to the booth, pay for the service and exchange the device for the charged mobile phone.

## Low level details

Communications are handled via Websockets. In this way we can achieve a two-way communication.

```
+---------+         +--------+         +--------+
|         |         |        |         |        |
| Charger +<------>>+ Server +<<------>+ Device |
|         |         |        |         |        |
+---------+         +--------+         +--------+
```

Chargers and Devices are the ones that connect to the Server:

```
+---------+         +--------+         +--------+
|         | connect |        | connect |        |
| Charger +------->>+ Server +<<-------+ Device |
|         |         |        |         |        |
+---------+         +--------+         +--------+
```

And in this PoC, messages flow from chargers to server, and from server to devices:

```
+---------+         +--------+         +--------+
|         | message |        | message |        |
| Charger +-------->+ Server +-------->+ Device |
|         |         |        |         |        |
+---------+         +--------+         +--------+
```

During the charging process, the charger sends its charge level to the server whenever the level changes.

The server processes these messages and sends a charging status to the device paired with that charger.

Each charger has a unique device paired with it (for example, the charger `c0001` is paired with the device `d0001`). For this PoC, we will assume there are only 3 chargers (`c0001`, `c0002` and `c0003`) and 3 devices (`d0001`, `d0003` and `d0003`).

### Chargers

Chargers connect to the server like this:

```typescript
const connection = new WebSocket("ws://localhost:3100/chargers/1234");
```

where `1234` is the charger id.

The Websocket (_stringified_) messages that the chargers send to the server indicating their percentage charge level (_State Of Charge_) are as follows:

```JSON
{
    "event": "StateOfCharge",
    "data": {
      "soc": 70
    }
}
```

### Devices (aka Beepers)

Devices connect to the server like this:

```javascript
const connection = new WebSocket("ws://localhost:3200/devices/ABCD");
```

where _ABCD_ is the device id.

The devices receive (_stringified_) Websocket messages from the server indicating the charging status:

```JSON
{
  "event": "ChargingStatus",
  "data": {
    "status": "charging"
  }
}
```

The possible states of charge are:

- `charging`
- `charging80`: charge level at 80% or higher
- `charged`: fully charged (100%)

## Your mission

Our CTO has hacked a (very rough) Proof of Concept (PoC) Server. Chargers and devices can connect via websockets to the server, but it only works properly (_miraculously_ I would say) for charger `c0001` and its paired device `d0001`.

You can run this server with:

```bash
npm run start:server
```

Your mission is to refactor this PoC and improve the code to something that resembles production level code.

Also we want to see how you would test a system like this.

## Support tools

To make your life easier, we have created some mocks of the charger (`./mocks/charger`) and the device (`./mocks/device`). They will help you to validate manually that what you've done works properly. You should launch each one in a different terminal. Take a look at the `package.json` npm scripts:

### Charger mock

```bash
npm run start:charger
```

By default it connects as charger `c0001` to the server and allows you to send charge level messages via a prompt.

You can connect as any other charger running:

```bash
npm run start:charger -i c0002
```

### Device mock

```bash
npm run start:device
```

By default it connects as device `d0001` to the server and displays the statuses it receives on the screen.

You can connect as any other device running:

```bash
npm run start:device -i dABCD
```

## Aspects to consider:

- It should take you about 2 hours to get it done. We don't want you to spend too much time. Remember that you should also implement some tests, so please reserve time for them.
- **Your code should be simple, understandable, well structured, ...**
  You know, all that Clean Code, Solid, _blah blah blah_ stuff

- Don't do more than what is asked.

- Write your server code only in the `./server/lib` directory. Feel free to add as many files/directories as you may find appropriate, but only inside `./server/lib`. There, you will find the PoC server. You can use it as a starting point for your refactor. You only need to respect the exported function so that `./index.ts` and the _npm scripts_ keep working.

- (Node> = 16) && (JavaScript || TypeScript) [Better with TypeScript!]

- You may use any library that you deem helpful in the development. The only requirement is that you keep using the _ws_ library (https://github.com/websockets/ws/) for the Websockets. Probably, it's the only dependency that you'll need! Using a framework (such as NestJS) is surely overkill.

- You don't need to use any database (SQL / NoSQL). As you will see in the PoC, the association between chargers and devices can be stored in memory. Anyway, you should probably prepare for the future, and assume that this relationship should be handled asynchronously.

- We want you to include some acceptance tests (_charger -> server -> device_). We have added some boilerplate for you in the `./tests` directory. Implement the 3 test cases that you'll find in `./tests/acceptance.spec.ts`. If you need to create some helper code (you probably will), please, add it in the directory `./tests/utils`. Make any use of the mocks if you feel appropriate.

- Your servers and tests shall be run with the npm scripts found in `./package.json`.

- If you want, initialize an empty git repository. It is always great to wrap work in small and descriptive commits 😉

- DO NOT edit anything in the `./mocks/device` and `./mocks/charger` folders. As mentioned, use only the `./server/lib` directory for your implementation and the `./server/tests/acceptance.spec.ts` and `./server/tests/util/` for your acceptance tests.
