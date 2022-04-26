import {
  ConnectionToServer,
  createConnectionToServer,
} from "./connection-to-server";

import {
  UpdateChargeStatusIndicatorFn,
  createUpdateChargeStatusIndicatorFn,
} from "./charge-status.indicator";

import * as Rx from "rxjs";

export class DeviceMock {
  protected statusSubject: Rx.Subject<string>;
  protected connectionToServer: ConnectionToServer;
  protected updateChargeStatusIndicatorFn: UpdateChargeStatusIndicatorFn;

  protected id: string;
  protected url: string;

  constructor({
    id,
    url,
    updateChargeStatusIndicatorFn,
  }: {
    id: string;
    url: string;
    updateChargeStatusIndicatorFn: UpdateChargeStatusIndicatorFn;
  }) {
    this.statusSubject = new Rx.Subject<string>();
    this.id = id;
    this.url = url;
    this.updateChargeStatusIndicatorFn = updateChargeStatusIndicatorFn;
  }

  public async start(): Promise<void> {
    this.statusSubject.subscribe((status) => {
      this.updateChargeStatusIndicatorFn(status);
    });

    this.connectionToServer = createConnectionToServer({
      url: this.url,
      id: this.id,
      statusSubject: this.statusSubject,
    });

    await this.connectionToServer.connect();
    console.log(`[Connected to Server] deviceId: ${this.id}`);
  }
}

export function createDeviceMock({
  id,
  url,
  updateChargeStatusIndicatorFn,
}: {
  id: string;
  url: string;
  updateChargeStatusIndicatorFn?: UpdateChargeStatusIndicatorFn;
}): DeviceMock {
  if (!updateChargeStatusIndicatorFn) {
    updateChargeStatusIndicatorFn = createUpdateChargeStatusIndicatorFn();
  }

  return new DeviceMock({ id, url, updateChargeStatusIndicatorFn });
}
