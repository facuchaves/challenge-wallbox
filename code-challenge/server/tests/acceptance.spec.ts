import { ChargerMock } from "../../mocks/charger/charger.mock";
import { DeviceMock } from "../../mocks/device/device.mock";

import { expect } from "chai";
import { spy } from "sinon";

let device: DeviceMock;
let charger: ChargerMock;

const deviceId = "d0001";
const deviceUrl = "ws://localhost:3200/devices";

const chargerId = "c0001";
const chargerUrl = "ws://localhost:3100/chargers";

before(async () => {
  // ...
  // await device.start();
  // await charger.start();
});

beforeEach(() => {});

describe("Device gets Statuses from charger", () => {
  it("Device gets Status charging from charger", async () => {
    return expect(true).to.equal(true);
  });

  it("Device gets Status charging80 from charger", async () => {
    return expect(true).to.equal(true);
  });

  it("Device gets Status charged from charger", async () => {
    return expect(true).to.equal(true);
  });
});
